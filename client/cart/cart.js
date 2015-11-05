Template.cart.helpers({
	'cart': function(){
		var cartObject = Cart.find();
		var count = cartObject.count();
	
		Session.set("cartCount",count);  			

		return cartObject;
	}
});

Template.cart.events({
	'click .delete': function () {
 		Meteor.call("deleteCartItem2", this._id);
	},
	'click .confirm': function(){
		var cartObjects = Cart.find();
		var emailVar = Session.get("username");
		var userVar = Profiles.findOne({email: emailVar})._id;

		cartObjects.forEach(function(doc){
			var nameVar = doc.name;
			var priceVar = doc.price;
			var associatedProfile = Profiles.findOne({_id: doc.owner});
			var ownerVar = associatedProfile.name;
			var phnoVar = associatedProfile.phno;
			var authorVar = doc.author;
			var publisherVar = doc.publisher;
			var editionVar = doc.edition;

			Pickup.insert({
				name: nameVar,
				price: priceVar,
				owner: ownerVar,
				author: authorVar,
				publisher: publisherVar,
				edition: editionVar,
				phno: phnoVar,
				user: userVar
			});

			Meteor.call("removeBook",doc._id,doc.bookId);
		});

		Router.go("/profile");
	}
});
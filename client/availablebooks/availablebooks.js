Template.availablebooks.helpers({
	'books': function(){
		var bookname = Session.get("bookname");
	
		var options = Session.get("options");
		var exp = [];
		var test = { $regex : new RegExp(bookname), $options: 'i'};
		options.forEach(function(array){
			if(array=="name"){
				exp.push({name: test});
			}
			else if(array=="author"){
				exp.push({author: test});
			}
			else{
				exp.push({publisher: test});
			}

		});

		var booksObject = Books.find({ $or: exp });
		if(booksObject.count()==0) {
			Session.set("query",false);
			window.alert("Book does not exist in the database");
		}

		return booksObject;
	}
});

Template.availablebooks.events({
	'click .reset button': function(){
		//Books.update({chosen: true},{$set: {chosen: false}},{multi:true});
		Session.set("query",false);
	},
	'click .addtocart': function(){
		var bookID = this._id;
		Books.update(bookID, { $set: { chosen: !this.chosen} });
		var doc = Books.findOne(bookID);
		if(doc.chosen) {
			var nameVar = doc.name;
			var authorVar = doc.author;
			var publisherVar = doc.publisher;
			var editionVar = doc.edition;
			var priceVar = doc.price;
			var ownerVar = doc.owner;

			Cart.insert({
				name: nameVar,
				author: authorVar,
				publisher: publisherVar,
				edition: editionVar,
				price: priceVar,
				owner: ownerVar,
				bookId: bookID 
			});
		}
		else {
			Meteor.call("deleteCartItem",bookID);
		}
	},
	'click .cart button': function(){
		Router.go("/cart");
	}
});
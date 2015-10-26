Books = new Mongo.Collection("books");
Profiles = new Mongo.Collection("profiles");
Cart = new Mongo.Collection("cart");
Pickup = new Mongo.Collection("pickup");



if (Meteor.isClient) {
	Template.signup.events({
		'submit form': function(event, template){
			event.preventDefault();
			var emailVar = template.find('#signup-email').value;
			var passwordVar = template.find('#signup-password').value;
			Accounts.createUser({
				email: emailVar,
				password: passwordVar 
			},
			function(error){
				if(error){
					window.alert("User exists. Try another ID");
				}
				else{
					Session.set("username",emailVar);
					Router.go("/profile");
				}
			});
			//Router.go("/");
    	}

	});

	Template.profile.events({
		'submit .first-form': function(event,template){
			event.preventDefault();
			var nameVar = template.find('#name').value;
			var phnoVar = template.find('#phno').value;
			var addressVar = template.find('#address').value;
			var emailVar = Session.get("username");
			var userID = Meteor.userId();
			
			if(nameVar != "") {
			Profiles.insert({
      			name: nameVar,
      			phno: phnoVar,
      			address: addressVar,
      			email: emailVar,
      			user: userID
    		});
			}

    		template.find('#name').value= "";
			template.find('#phno').value = "";
			template.find('#address').value = "";
			//template.find('#email').value = "";

			Router.go("main");

		},
		'submit .update-form': function(event,template){
			event.preventDefault();
			var nameVar = template.find('#update-name').value;
			var phnoVar = template.find('#update-phno').value;
			var addressVar = template.find('#update-address').value;
			var emailVar = Session.get("username");
			var userID = Meteor.userId();

			var id = Profiles.findOne({email: emailVar})._id;
			
			if(nameVar != "") {
			Profiles.update(id,{
      			name: nameVar,
      			phno: phnoVar,
      			address: addressVar,
      			email: emailVar,
      			user: userID
    		});
			}

    		template.find('#update-name').value= "";
			template.find('#update-phno').value = "";
			template.find('#update-address').value = "";
			Session.set("updateForm",false);
		},
		'click #update': function(){
			Session.set("updateForm",true);
		},
		'click #cancel': function(){
			Session.set("updateForm",false);
		},
		'click #cancelPickup': function(){
			Meteor.call("cancelPickup",this);
		},
		'click #receivedPickup': function(){
			Meteor.call("receivedPickup",this._id);
		}



	});

	Template.profile.helpers({
		'profileExists': function(){
			var emailVar = Session.get("username");
			//console.log(emailVar);
			return Profiles.findOne({email: emailVar});
		},
		'updateForm': function(){
			return Session.get("updateForm");
		},
		'pickup': function(){
			var emailVar = Session.get("username");
			var userVar = Profiles.findOne({email: emailVar})._id;

			return Pickup.find({user: userVar});
		},
		'collection': function(){
			var emailVar = Session.get("username");
			var userVar = Profiles.findOne({email: emailVar})._id;

			if(Pickup.find({user: userVar}).count())
				return true;
			else
				return false;
		}

	});

	Template.login.events({
		'submit form': function(event, template){
			event.preventDefault();
			var emailVar = template.find('#login-email').value;
			var passwordVar = template.find('#login-password').value;
			Meteor.loginWithPassword(emailVar,passwordVar,function(error){
				if(error){
					window.alert("Invalid Login. Try Again");
				}
				else{
					Session.set("username",emailVar);
					Session.set("query",false);
					Router.go("/");
				}
			});
			//Router.go("/");
		}

	});
	Template.navbar.events({
		'click .logout': function(event){
			event.preventDefault();
			Meteor.call("emptyCart");
			Meteor.logout();
			Router.go("/");
		}
	});
	Template.navbar.helpers({
		'user': function(){
			var profile = Profiles.findOne({user: Meteor.userId()});
			Session.set("username",profile.email);
			return profile.email;
		},
		'cartCount': function(){
			return Session.get("cartCount");
		}
	});

	Template.availablebooks.helpers({
		'books': function(){

			var bookname = Session.get("bookname");
			//console.log(new RegExp(bookname));
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

			console.log(exp);
			
			/*var f = JSON.parse(e);
			console.log(f);*/


			var booksObject = Books.find({ $or: exp });
			if(booksObject.count()==0) {
				Session.set("query",false);
				window.alert("Book does not exist in the database");
			}
			//console.log(booksObject);
			return booksObject;
			
		}
	});

	Template.availablebooks.events({
		'click .reset button': function(){
			//Books.update({chosen:true},{$set: { chosen: false } });
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

	Template.cart.helpers({
		'cart': function(){
			var cartObject = Cart.find();
			var count = cartObject.count();
    		/*if(count==0) {
    			//window.alert("No book added to cart");
    			//Router.go("/");
    		}
    		else {*/
    			Session.set("cartCount",count);  			

    			return cartObject;
    		
    		//}
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

	Template.searchbar.events({
		'submit form': function(event,template){
			event.preventDefault();

			var bookname = event.target.search.value;
			//bookname = "/" + bookname + "/";
			Session.set("bookname",bookname);
			Session.set("query",true);

			var selected = template.findAll( "input[type=checkbox]:checked");

   			var array2 = _.map(selected, function(item) {
     			return item.defaultValue;
   			});

   			var array = [];
   			array.push("name");
   			array2.forEach(function(element){
   				array.push(element);
   			});

   			Session.set("options",array);
   			//console.log(array2);
   			//console.log(array);
			//Router.go("/buy");
		}
	});

	Template.searchbar.helpers({
		'query': function(){
			return Session.get("query");
		}
	});

	Template.sell.events({
		'submit form': function(event,template){
			event.preventDefault();
			var nameVar = template.find('#name').value;
			var authorVar = template.find('#author').value;
			var publisherVar = template.find('#publisher').value;
			var editionVar = template.find('#edition').value;
			var priceVar = template.find('#price').value;

			var ownerVar = Profiles.findOne({user : Meteor.userId()})._id;
			
			if(nameVar != "") {
			Books.insert({
      			name: nameVar,
      			author: authorVar,
      			publisher: publisherVar,
      			edition: editionVar,
      			price: priceVar,
      			owner: ownerVar,
      			chosen: false
    		});
			}

    		template.find('#name').value= "";
			template.find('#author').value = "";
			template.find('#publisher').value = "";
			template.find('#edition').value = "";
			template.find('#price').value = "";
		}
	});

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

Router.route('main', {
	path:'/',
	template:'main',
});

Router.route('/signup');
Router.route('/login');
Router.route('/sell');
Router.route('/cart');
Router.route('/profile');
Router.route("/help");

Meteor.methods({
	'deleteCartItem': function(id){
		Cart.remove({bookId: id});
	},
	'deleteCartItem2': function(id){
		var bookID = Cart.findOne(id).bookId;
		Books.update(bookID,{$set: {chosen: false}});
		Cart.remove(id);
		
	},
	'emptyCart': function(){
		Books.update({chosen: true},{$set: {chosen: false}},{multi:true});
		Cart.remove({});
	},
	'removeBook': function(cartId,bookId){
		Cart.remove({_id: cartId});
		Books.remove({_id: bookId});
	},
	'cancelPickup': function(book){
		var ownerVar = Profiles.findOne({name:book.owner})._id;

		Books.insert({
      			name: book.name,
      			author: book.author,
      			publisher: book.publisher,
      			edition: book.edition,
      			price: book.price,
      			owner: ownerVar,
      			chosen: false
    		});

		Pickup.remove(book._id);
	},
	'receivedPickup': function(id){
		Pickup.remove(id);
	}

});
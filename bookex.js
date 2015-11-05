Books = new Mongo.Collection("books");
Profiles = new Mongo.Collection("profiles");
Cart = new Mongo.Collection("cart");
Pickup = new Mongo.Collection("pickup");



if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}



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
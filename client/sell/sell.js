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
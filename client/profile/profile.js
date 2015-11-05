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
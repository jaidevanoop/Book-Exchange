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
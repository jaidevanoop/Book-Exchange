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
	}
});
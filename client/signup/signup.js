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
	}

});
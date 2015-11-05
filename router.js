Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function(){
	this.route('main',{path:'/'});
	this.route('signup',{path:'/signup'});
	this.route('login',{path:'/login'});
	this.route('sell',{path:'/sell'});
	this.route('cart',{path:'/cart'});
	this.route('profile',{path:'/profile'});
	this.route('help',{path:'/help'});
})



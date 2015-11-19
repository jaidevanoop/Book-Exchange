Template.panel.helpers({
	'bought': function(){
		var profileId = this._id;
		return Pickup.find({user: profileId});
	},
	'sold': function(){
		var profileId = this._id;
		return Books.find({owner: profileId});
	}
});

Template.panel.events({

});
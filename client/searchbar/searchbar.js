Template.searchbar.events({
	'submit form': function(event,template){
		event.preventDefault();

		var bookname = event.target.search.value;

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
	}
});

Template.searchbar.helpers({
	'query': function(){
		return Session.get("query");
	}
});
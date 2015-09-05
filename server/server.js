Meteor.startup(function() {
	Meteor.methods({
		getPage: function(url) {
			this.unblock();
			return Meteor.http.call("GET", url);
		}
	});
});
Meteor.startup(function() {
	Tracker.autorun(function () {
	  var geo = Geolocation.latLng();
	  Session.set('geo', geo);
	}); 
});

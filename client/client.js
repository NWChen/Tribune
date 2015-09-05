Meteor.startup(function() {
	GoogleMaps.load();
	Meteor.call("getPage", "https://en.wikipedia.org/w/api.php?action=query&titles=Empire%20State%20Building&prop=revisions&rvprop=content&format=json", function(error, results) {
		console.log(results.content);
	});
});
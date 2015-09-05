Meteor.startup(function() {
	//obtain and clean up label summaryz
	Meteor.call("getPage", "https://en.wikipedia.org/w/api.php?action=query&titles=Chrysler%20Building&prop=extracts&rvprop=content&format=json", function(error, results) {
		var str = JSON.stringify(results.content.replace(/(<([^>]+)>)/ig,""));
		var extract = str.substring(str.indexOf("extract")+12, str.indexOf("\\\\n")).replace("\\\\u00a0", " ");
	});
});

Meteor.startup(function() {
	function initialize() {
	  geocoder = new google.maps.Geocoder();
	  var fenway = new google.maps.LatLng(42.345573, -71.098326);
	  var mapOptions = {
	    center: fenway,
	    zoom: 14
	  };
	  map = new google.maps.Map(document.getElementById('map'), mapOptions);

	  var panoramaOptions = {
	    position: fenway,
	    pov: {
	      heading: 34,
	      pitch: 10
	    }
	  };
	  panorama = new google.maps.StreetViewPanorama(document.getElementById('sv'), panoramaOptions);
	  map.setStreetView(panorama);
	};

	google.maps.event.addDomListener(window, 'load', initialize);

	Meteor.call("getPage", "https://en.wikipedia.org/w/api.php?action=query&titles=Empire%20State%20Building&prop=revisions&rvprop=content&format=json", function(error, results) {
		console.log(results.content);
	});
});

Template.home.onCreated(function() {
	console.log("oncreated here");
	GoogleMaps.ready("map", function(map) {
		console.log("map here");
		var marker = new google.maps.Marker({
	      position: map.options.center,
	      map: map.instance
	    });
	});
});

Template.home.helpers({
	MapOptions: function() {
		loc = Geolocation.latLng()
		if (GoogleMaps.loaded()) {
			return {
				center: new google.maps.LatLng(loc.lat, loc.lng),
				// center: new google.maps.LatLng(-37.8136, 144.9631),
				zoom: 15
			};
		}
  	}
});

Template.home.events({

});
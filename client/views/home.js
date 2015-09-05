
geocoder = null;
map = null;
panorama = null;
var loc = null;

Template.home.onCreated(function() {
	// GoogleMaps.ready("map", function(map) {
	// 	console.log("map here");
	// 	var marker = new google.maps.Marker({
	//       position: map.options.center,
	//       map: map.instance
	//     });

	//     map.instance.setStreetView(GoogleMaps.maps.svmap);
	//     console.log(GoogleMaps.maps.svmap);
	// });
	// GoogleMaps.ready("svmap", function(map) {
	// });
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
});

Template.home.helpers({
	MapOptions: function() {
		loc = Geolocation.latLng()
		if (GoogleMaps.loaded() && loc) {
			return {
				center: new google.maps.LatLng(loc.lat, loc.lng),
				// center: new google.maps.LatLng(-37.8136, 144.9631),
				zoom: 15
			};
		}
  	},
  	svMapOptions: function() {
  		loc = Geolocation.latLng()
  		if (GoogleMaps.loaded() && loc) {
  			console.log(loc);
  			console.log("___");
  			console.log(new google.maps.LatLng(loc.lat, loc.lng));
  			return {
  				// position: new google.maps.LatLng(loc.lat, loc.lng)
  				position: new google.maps.LatLng(-37.8136, 144.9631)
		        // pov: {
		        //   heading: 34,
		        //   pitch: 10
		        // }
  			};
  		}
  	},
  	geolocationError: function() {
 	  var error = Geolocation.error();
	  return error && error.message;
	}
});

Template.home.events({

});
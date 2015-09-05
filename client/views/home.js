
geocoder = null;
map = null;
panorama = null;

Template.main.onCreated(function() {
	yelpQuery('a','a','a','a');
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
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';

	  var infowindow = new google.maps.InfoWindow({
	    content: contentString
	  });
	
	function initialize() {
	  
	  console.log(Session.get('geo'))
	  geocoder = new google.maps.Geocoder();
	  var fenway = new google.maps.LatLng(42.345573, -71.098326);
	  var wells_fargo_stadium = new google.maps.LatLng(39.902114499999996, -75.17082359999999);
	  var mapOptions = {
	    center: fenway,
	    // center: fenway,
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

	  var cafeMarker = new google.maps.Marker({
	      position: {lat: 42.345573, lng: -71.098326},
	      map: map,
	      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00',
	      title: 'Cafe'
	  });
	  var cafeMarker2 = new google.maps.Marker({
	      position: {lat: 42.345573, lng: -71.098326},
	      map: panorama,
	      icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_icon&chld=cafe|FFFF00',
	      title: 'Cafe'
	  });

	  cafeMarker2.addListener('click', function() {
	  	infowindow.open(panorama, cafeMarker2);
	  })

	  /* Map Event Listeners */
	  panorama.addListener('position_changed', function() {
	  	console.log(panorama.getPosition().G);
	  	console.log(panorama.getPosition().K);
	  	//TODO collect yelp queries
	  })
	};
	google.maps.event.addDomListener(window, 'load', initialize);

	Meteor.call("getPage", "https://en.wikipedia.org/w/api.php?action=query&titles=Empire%20State%20Building&prop=revisions&rvprop=content&format=json", function(error, results) {
		console.log(results.content);
	});

	 

});
Template.main.helpers({
	getLocation: function() {
		loc = Geolocation.latLng();
		return loc;
	}
})

/* Yelp functions */
var yelpQuery = function(search, isCategory, longitude, latitude) {
  console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lng, lat) with vals (', search, isCategory, longitude, latitude, ')');

  // Query OAUTH credentials (these are set manually)
  var auth = Yelp.findOne();
  console.log(auth);
  return


  // Add auth signature manually
  auth['serviceProvider'] = { signatureMethod: "HMAC-SHA1" };

  var accessor = {
    consumerSecret: auth.consumerSecret,
    tokenSecret: auth.accessTokenSecret
  },
  parameters = {};

  // Search term or categories query
  if(isCategory)
    parameters.category_filter = search;
  else
    parameters.term = search;

  // Set lat, lon location, if available (SF is default location)
  if(longitude && latitude)
    parameters.ll = latitude + ',' + longitude;
  else
    parameters.location = 'San+Francisco';

  // Results limited to 5
  parameters.limit = 5;

  // Configure OAUTH parameters for REST call
  parameters.oauth_consumer_key = auth.consumerKey;
  parameters.oauth_consumer_secret = auth.consumerSecret;
  parameters.oauth_token = auth.accessToken;
  parameters.oauth_signature_method = auth.serviceProvider.signatureMethod;

  // Create OAUTH1 headers to make request to Yelp API
  var oauthBinding = new OAuth1Binding(auth.consumerKey, auth.consumerSecret, 'http://api.yelp.com/v2/search');
  oauthBinding.accessTokenSecret = auth.accessTokenSecret;
  var headers = oauthBinding._buildHeader();

  // Return data results only
  return oauthBinding._call('GET', 'http://api.yelp.com/v2/search', headers, parameters).data;
}
// Template.home.helpers({
// 	MapOptions: function() {
// 		loc = Geolocation.latLng()
// 		if (GoogleMaps.loaded() && loc) {
// 			return {
// 				center: new google.maps.LatLng(loc.lat, loc.lng),
// 				// center: new google.maps.LatLng(-37.8136, 144.9631),
// 				zoom: 15
// 			};
// 		}
//   	},
//   	svMapOptions: function() {
//   		loc = Geolocation.latLng()
//   		if (GoogleMaps.loaded() && loc) {
//   			console.log(loc);
//   			console.log("___");
//   			console.log(new google.maps.LatLng(loc.lat, loc.lng));
//   			return {
//   				// position: new google.maps.LatLng(loc.lat, loc.lng)
//   				position: new google.maps.LatLng(-37.8136, 144.9631)
// 		        // pov: {
// 		        //   heading: 34,
// 		        //   pitch: 10
// 		        // }
//   			};
//   		}
//   	},
//   	geolocationError: function() {
//  	  var error = Geolocation.error();
// 	  return error && error.message;
// 	}
// });

// Template.home.events({

// });
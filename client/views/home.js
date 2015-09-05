radius = 1;
userpos = null;
geocoder = null;
map = null;
panorama = null;

Template.main.onCreated(function() {
	var events = [] //for storing current events on map

	var contentString = '<div id="content">'+
    	'<div id="siteNotice">'+
      	'</div>'+
      	'<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      	'<div id="bodyContent">'+
      	'<p><b>Swag</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
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

	//grab user's current physical location
	if(navigator.geolocation) {
  	browserSupportFlag = true;
  	navigator.geolocation.getCurrentPosition(function(position) {
    	userpos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  	}, function() {
    		handleNoGeolocation(browserSupportFlag);
  	});
	} else {
    userpos = new google.maps.LatLng(40.7127, 74.0059);
	}
	

	//recursively look for a valid streetview position
	function handler(data, status) {
		if(status==google.maps.StreetViewStatus.OK) {
			var userpos = data.location.latLng;
		} else {
			radius += 5;
			streetViewService.getPanoramaByLocation(userpos, radius, handler);
		}
	}

	function initialize() {
  	geocoder = new google.maps.Geocoder();

    streetViewService = new google.maps.StreetViewService();
    streetViewService.getPanoramaByLocation(userpos, radius, handler);

		var mapOptions = {
		    center: userpos,
		    zoom: 16
	  	};
	  map = new google.maps.Map(document.getElementById('map'), mapOptions);

  	var panoramaOptions = {
    	position: userpos,
    	pov: {
     	 	heading: 34,
	      	pitch: 10
    	}
  	};
		panorama = new google.maps.StreetViewPanorama(document.getElementById('sv'), panoramaOptions);
	  	map.setStreetView(panorama);

	  	var cafeMarker = new google.maps.Marker({
			position: {lat: 39.9166412353516, lng: -75.1684875488281},
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
	  		// console.log(Meteor.call("searchYelp", '', 'false', panorama.getPosition().G, panorama.getPosition().K));
	  		Meteor.call("searchYelp", '', 'false', panorama.getPosition().G, panorama.getPosition().K, function(err, result) {
		  		if (err) {
		  			console.log(err)
		  		} else {
		  			console.log(result)
		  			result['businesses'].map(function(item) {
		  				console.log(item);
		  				console.log(events);
		  				if ($.inArray(item['id'], events) != -1) {
		  					console.log("in array, returning");
		  					return;
		  				}
		  				var marker = new google.maps.Marker({
		  					draggable: false,
		  					animation: google.maps.Animation.DROP,
		  					position: new google.maps.LatLng(item['location']['coordinate']['latitude'], item['location']['coordinate']['longitude']),
		  					map: map
		  					//TODO add icon
		  					//TODO add shape
		  					//TODO add id? 
		  				})
		  				var svmarker = new google.maps.Marker({
		  					draggable: false,
		  					animation: google.maps.Animation.DROP,
		  					position: new google.maps.LatLng(item['location']['coordinate']['latitude'], item['location']['coordinate']['longitude']),
		  					map: panorama
		  					//TODO add icon
		  					//TODO add shape
		  					//TODO add id? 
		  				})

		  				var contentString = '<div id="content">'+
					    	'<div id="siteNotice">'+
					      	'</div>'+
					      	'<h1 class="firstHeading">' + item['name'] + '</h1>'+
					      	'<div class="location-image"><img src="' + item['image_url'] + '"></div>' +
					      	'<div class="location-rating"><img src="' + item['rating_img_url'] + '"></div>' +
					      	'<div class="bodyContent">'+
					      	'<p>' + item['snippet_text'] + '</p>'+
					      	'<p><a href="' +  item['url'] + '" target="_blank">Link</a>'+
					      	'</div>'+
					      	'</div>';
					    var infowindow = new google.maps.InfoWindow({
    						content: contentString
  						});
					    events.push(item['id']);
		  				marker.addListener('click', function() {
		  					// infowindow.open(panorama, svmarker);
		  					infowindow.open(map, marker);
		  				})
		  				svmarker.addListener('click', function() {
		  					// infowindow.open(panorama, svmarker);
		  					infowindow.open(map, marker);
		  				})
		  			})
		  		}
  			});
	  	//TODO collect yelp queries
	  	})
	};

	google.maps.event.addDomListener(window, 'load', initialize);
});

Template.main.helpers({
	getLocation: function() {
		loc = Geolocation.latLng();
		return loc;
	}
})


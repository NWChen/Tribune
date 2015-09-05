function revGeocode(geocoder, map, latlng) {
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results) {
      	console.log(results)
        // map.setZoom(11);
        // var marker = new google.maps.Marker({
        //   position: latlng,
        //   map: map
        // });
        // infowindow.setContent(results[1].formatted_address);
        // infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}
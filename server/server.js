var getYelpOauthBinding = function(url) {
  
  // var config = Yelp.findOne({service: 'yelp'});
  var config = {
  	"consumerKey" : "MScCZF4c_8rc-KH6dfx3GA", 
  	"consumerSecret" : "fqr5b4smJmQzoErNT00ndzKlTzo", 
  	"accessToken" : "o3TKKDUd6GfvTFVyHwsHyVWelD1rrqDo", 
  	"accessTokenSecret" : "jn83jzKHt6ECmIeu6ZpaqkOS74U",
    "clientId" : "USXH5WGYCGFVNHWL1DIXECUCKQP2LEUP5OWF2FQVZDMU0AKO",
    "clientSecret" : "L4IBFRRAGQG0GSBZIAFUUHTZK1KK3Q3LW5OZIVZ3FOUNJF3C"
  };
  console.log(config);
  if (config) {
    config.secret = config.consumerSecret;
    var oauthBinding = new OAuth1Binding(config, url)
    oauthBinding.accessToken = config.accessToken;
    oauthBinding.accessTokenSecret = config.accessTokenSecret;

    return oauthBinding;
  } else {
    throw new Meteor.Error(500, 'Yelp Not Configured');
  }  
}

Meteor.methods({
  searchYelp: function(search, isCategory, latitude, longitude) {
  	// return "hi";
    this.unblock();
    
    console.log('Yelp search for userId: ' + this.userId + '(search, isCategory, lat, lon) with vals (', search, isCategory, latitude, longitude, ')');
    
    // Add REST resource to base URL
    var yelp_base_url = 'http://api.yelp.com/v2/'
    var url = yelp_base_url + 'search';

    var oauthBinding = getYelpOauthBinding(url);
    
    // Build up query
    var parameters = {};
    // Search term or categories query
    if(isCategory)
      parameters.category_filter = search;
    else
      parameters.term = search;

    // Set lat, lon location, if available or default location
    if(longitude && latitude)
      parameters.ll = latitude + ',' + longitude;
    else
      parameters.location = 'New+York';
  	parameters.radius=100;
  	parameters.sort=1;

    // Results limited to 20
    parameters.limit = 20;
    console.log("parameters")
    console.log(parameters)

    // Only return .data because that is how yelp formats its responses
    return oauthBinding.get(url, parameters).data;

  },
  test: function() {
  	return "hi";
  },
  yelpBusiness: function(id) {
    this.unblock();
    console.log('Yelp business for userId: ' + this.userId + '(id, lat, lon) with vals (', id, ')');
    var url = yelp_base_url + 'business/' + id;
    // Query OAUTH credentials (these are set manually)
    var oauthBinding = getYelpOauthBinding(url);

    // Only return .data because that is how yelp formats its responses
    return oauthBinding.get(url).data;
  },
  getPage: function(url) {
    this.unblock();
  	return Meteor.http.call("GET", url);
  },
	getWikiSummary: function(url) {
		this.unblock();
		var str = JSON.stringify(Meteor.call("getPage", url).content.replace(/(<([^>]+)>)/ig,""));
		var extract = str.substring(str.indexOf("extract")+12, str.indexOf("\\\\n")).replace("\\\\u00a0", " ");
		return extract;
	},
  initFoursquare: function() {
    Foursquare.init({
      id: config.clientId,
      secret: config.clientSecret,
      authOnly: false
    });
    /*
    this.unblock();
    var radius = 100;
    var section = "specials";
    var url = "https://api.foursquare.com/v2/venues/explore?ll="+lat+","+lng+"&radius="+radius+"&section="+section;
    return Meteor.call("getPage", url);
    */
  },
  updateLocation: function(lat, lng, id) {
  	this.unblock();
  	return People.upsert({"id" : id},{$set : {"lat" : lat, "lng" : lng, "id" : id}});
  },
  removeUser: function(id) {
  	People.remove({"id" : id});
  }
});
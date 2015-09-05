
//metro can be = to: "philly","chicago","boston","houston", or "denver"
//ex zip code for wells fargo: 19148

function getNewsForZipCode(metro, zipcode) {
	this.unblock();
	return Meteor.http.call("GET", "https://api.everyblock.com/content/" + metro + "/locations/"+ zipcode + "/timeline/?token=90fe24d329973b71272faf3f5d17a8602bff996b)";

}


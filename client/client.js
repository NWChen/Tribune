Meteor.startup(function(){
    console.log('------------------------------------------------');
    Meteor.call("getNearbyLandmarks", 40.729884, -73.990988, function(error, res) {
        console.log(res);
    });
    $(window).bind('beforeunload', function() {
        closingWindow();

        // have to return null, unless you want a chrome popup alert
        return null;

        // have to return null, unless you want a chrome popup alert
        //return 'Are you sure you want to leave your Vonvo?';
    });
});
closingWindow = function(){
    console.log('closingWindow');
    Meteor.call('removeUser', id);
}
Meteor.startup(function(){
    console.log('------------------------------------------------');

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
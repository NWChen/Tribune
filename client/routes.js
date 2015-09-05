Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading'
});

Router.map(function() {
	this.route('main', {path: '/'});
	// this.route('login');
});





// Router.route('/', {name: 'home', controller: 'MainController'});

// MainController = RouteController.extend({
//   action: function() {
//   	this.render('home', {
// 	    data: function () {
// 	      return { posts: ['post red', 'post blue'] }
// 	    }
//   	});
//   }
// });
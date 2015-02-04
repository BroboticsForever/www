angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/links', {
			templateUrl: 'views/links.html',
			controller: 'LinksController'
		})

		.when('/about', {
			templateUrl: 'views/about.html',
			controller: 'AboutController'
		})

		.otherwise({
		    templateUrl: 'views/notfound.html',
			controller: 'NotFoundController'
        });

	$locationProvider.html5Mode(true);

}]);
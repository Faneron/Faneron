angular.module('app', ['ui.router', 'faneronControllers', 'faneronServices', 'ngAnimate'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		// $urlRouterProvider.otherwise('/');
		$stateProvider
			.state('front', {
				url: '/',
				templateUrl: '/partials/frontpage'
			})
			.state('signup', {
				url: '/signup',
				templateUrl: '/partials/signup',
				controller: 'signupCtrl'
			})
			.state('explore', {
				url: '/explore',
				templateUrl: '/partials/explore',
				controller: 'exploreCtrl'
			})
			.state('project', {
				url: '/projects/:id',
				templateUrl: '/partials/project',
				controller: 'projectCtrl'
			})
			.state('profile', {
				// will add user ids to this later
				url: '/profile',
				templateUrl: '/partials/profile',
				controller: 'profileCtrl'
			})
				.state('profile.bio', {
					url: '/bio',
					templateUrl: '/partials/profile_bio'
				})
				.state('profile.projects', {
					url: '/projects',
					templateUrl: '/partials/profile_projects'
				})
				.state('profile.thoughts', {
					url: '/thoughts',
					templateUrl: '/partials/profile_thoughts'
				})
				.state('profile.art', {
					url: '/art',
					templateUrl: '/partials/profile_art'
				});
	}])

	// Removes hash (#) from URL
	.config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true);
	}]);
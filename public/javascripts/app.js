angular.module('app', ['ui.router'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $q, $timeout) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('front', {
				url: '/',
				templateUrl: '/partials/frontpage'
			})
			.state('signup', {
				url: '/signup',
				templateUrl: '/partials/signup'
			})
			.state('profile', {
				url: '/profile/:id',
				templateUrl: '/partials/profile'
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
angular.module('app', ['ui.router', 'faneronControllers', 'faneronServices', 'ngAnimate'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider, $q) {
		$stateProvider
			.state('err', {
				url: '/err',
				templateUrl: '/partials/error'
			})
			.state('front', {
				url: '/',
				templateUrl: '/partials/frontpage'
			})
			.state('signup', {
				url: '/signup',
				templateUrl: '/partials/signup',
				controller: 'signupCtrl',
				resolve: {
					auth: function(LoggedInService) {
						return LoggedInService.check();
					}
				}
			})
			.state('login', {
				url: '/login',
				templateUrl: '/partials/login',
				controller: 'loginCtrl',
				resolve: {
					auth: function(LoggedInService) {
						return LoggedInService.check();
					}
				}
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
				.state('project.description', {
					url:'/description',
					templateUrl: '/partials/project_description'
					// inherit controller from project
				})
			.state('profile', {
				// will add user ids to this later
				url: '/users/:username',
				templateUrl: '/partials/profile',
				controller: 'profileCtrl'
			})
				.state('profile.bio', {
					url: '/bio',
					templateUrl: '/partials/profile_bio'
				})
				.state('profile.projects', {
					url: '/projects',
					templateUrl: '/partials/profile_projects',
					controller: 'profileProjectsCtrl'
				})
					.state('profile.projects.new', {
						url: '/new',
						templateUrl: '/partials/profile_projects_new',
						controller: 'newProjectCtrl'
					})
				.state('profile.thoughts', {
					url: '/thoughts',
					templateUrl: '/partials/profile_thoughts'
				})
				.state('profile.art', {
					url: '/art',
					templateUrl: '/partials/profile_art'
				})
			.state('new_project', {
				url: '/projects/new',
				templateUrl: '/partials/profile_projects_new',
				controller: 'newProjectCtrl'
			});
	}])

	// Removes hash (#) from URL
	.config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true);
	}]);
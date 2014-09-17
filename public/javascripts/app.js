angular.module('app', ['ui.router', 'faneronControllers', 'faneronServices', 'ngAnimate'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.when('/users/:username', '/users/:username/bio');
		$urlRouterProvider.when('/projects/:id', '/projects/:id/description');

		$stateProvider
			.state('err', {
				url: '/err',
				templateUrl: '/partials/error'
			})
			.state('err_proj', {
				url: '/project_err',
				templateUrl: '/partials/project_error'
			})
			.state('front', {
				url: '/',
				templateUrl: '/partials/frontpage',
				resolve: {
					auth: function(LoggedInService) {
						return LoggedInService.check();
					}
				}
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
					templateUrl: '/partials/project_description',
					controller: 'projectDescriptionCtrl'
				})
				.state('project.comments', {
					url: '/comments',
					templateUrl: '/partials/project_comments',
					controller: 'projectCommentsCtrl'
				})
				.state('project.gameplay', {
					url: '/gameplay',
					templateUrl: '/partials/project_gameplay',
					controller: 'projectGameplayCtrl'
				})
				.state('project.lore', {
					url: '/lore',
					templateUrl: '/partials/project_lore',
					controller: 'projectLoreCtrl'
				})
				.state('project.images', {
					url: '/art',
					templateUrl: '/partials/project_images',
					controller: 'projectImagesCtrl'
				})
			.state('profile', {
				// will add user ids to this later
				url: '/users/:username',
				templateUrl: '/partials/profile',
				controller: 'profileCtrl'
			})
				.state('profile.bio', {
					url: '/bio',
					templateUrl: '/partials/profile_bio',
					controller: 'profileBioCtrl'
				})
				.state('profile.projects', {
					url: '/projects',
					templateUrl: '/partials/profile_projects',
					controller: 'profileProjectsCtrl',
				})
					.state('newProject', {
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
					templateUrl: '/partials/profile_art',
					controller: 'profileArtCtrl'
				})
			.state('new_project', {
				url: '/projects/new',
				templateUrl: '/partials/profile_projects_new',
				controller: 'newProjectCtrl'
			})
			.state('comment_thread', {
				url: '/comments/:id',
				templateUrl: '/partials/comment_thread',
				controller: 'commentThreadCtrl'
			});
	}])

	// Removes hash (#) from URL
	.config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true);
	}])
	.directive('dir', function() {
		return function(scope, elem, attrs) {
			var $elem = $(elem);
			var img = $elem.find("img");
			img.height(scope.project.coverHeight * $elem.width());
			console.log(scope);
			if (scope.$first) {
				setTimeout(function() {
					$('#container').masonry({itemSelector: '.project-card'});
				}, 200);
			} else {
				$('#container').masonry('appended', $(elem));
			}
		}
	})
	.directive('exploredir', function() {
		return function(scope, elem, attrs) {
			var $elem = $(elem);
			var img = $elem.find('img');
			img.height(scope.project.coverHeight * $elem.width());
			console.log(scope);
			if (scope.$first) {
				setTimeout(function() {
					$('#explore-container').masonry({itemSelector : '.explore-project-card', gutter: 20})
				}, 200);
			}
			else {
				$('#explore-container').masonry('appended', $(elem));
			}
		}
	});


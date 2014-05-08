angular.module('app', ['ui.router'])

	.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state('front', {
				url: '/',
				templateUrl: '/partials/frontpage'
			})
			.state('login', {
				url: '/login',
				templateUrl: '/partials/login'
			});
	}])

	.config(['$locationProvider', function($locationProvider) {
		$locationProvider.html5Mode(true);
	}])

	.controller('myController', ['$scope', function($scope) {
		$scope.text = '';
	}]);
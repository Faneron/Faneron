angular.module('app', ['ngRoute'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when( '/', {

		    })
		    .when('/login', {
		    	templateUrl: 'partials/login'
		    })
		    .otherwise({
		      redirectTo: '/'
		    });
			$locationProvider.html5Mode(true);
		})
	
	.controller('myController', ['$scope', function($scope) {
		$scope.text = '';
	}]);
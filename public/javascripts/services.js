angular.module('faneronServices', [])
	
	.factory('UserService', function($http, $location) {
		// Just random for now
		function signUp(config) {
			$location.url('/profile/5');
		}
		return {blah: signUp}
	})
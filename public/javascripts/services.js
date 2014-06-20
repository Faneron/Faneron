angular.module('faneronServices', ['ui.router'])
	
	// Checks if you're already logged in, redirects you to profile page
	// Use this when clicking on log in / sign up when you're already logged in
	.factory('LoggedInService', function($http, $state, $q) {
		return {
			check: function() {
				var deferred = $q.defer();
				$http({method: 'GET', url: '/auth/isAuthenticated'})
					.success(function(data) {
						console.log("Yasss!");
						$state.go('profile', {"username": data.info.username});
						deferred.reject("YAY");
					})
					.error(function(err) {
						console.log(err);
						deferred.resolve("yay");
					});
				return deferred.promise;
			}
		}
	});
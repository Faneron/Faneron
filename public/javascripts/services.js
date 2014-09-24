angular.module('faneronServices', ['ui.router'])
	
	// Checks if you're already logged in, redirects you to profile page
	// Use this when clicking on log in / sign up when you're already logged in
	.factory('LoggedInService', function($http, $state, $q) {
		return {
			check: function() {
				var deferred = $q.defer();
				$http({method: 'GET', url: '/auth/isAuthenticated'})
					.success(function(data) {
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
	})

	// Checks if logged in, redirects to login screen if not logged in
	.factory('RedirectService', function($http, $state, $q) {
		return {
			check: function() {
				console.log("checkin things out");
				var deferred = $q.defer();
				$http({method: 'GET', url: '/auth/isAuthenticated'})
					.success(function(data) {
						deferred.resolve('asdfasdf');
						console.log('you are logged in');
					})
					.error(function(err) {
						console.log(err);
						$state.go('login');
						deferred.reject("asdf");
					});
				return deferred.promise;
			}
		}
	});

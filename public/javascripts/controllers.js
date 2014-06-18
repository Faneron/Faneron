	// Controllers
angular.module('faneronControllers', ['faneronServices', 'ui.router'])

	.controller('navCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		$scope.loggedIn = false;
		$scope.$on('$stateChangeSuccess', function() {
			$http({method: 'GET', url: '/login/current'})
			.success(function(data) {
				$scope.data = data;
				$scope.loggedIn = true;
			})
			.error(function(err) {
				console.log(err);
				$scope.loggedIn = false;
			});
		});
		
		$scope.logout = function() {
			$http({method: 'GET', url: '/logout'})
				.success(function(data) {
					console.log(data);
					$state.go(data.redirect);
				})
				.error(function(err) {
					console.log(err);
				});
		}
	}])
	
	.controller('signupCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		// Waiting for http post route to create a user
		$scope.signup = function() {
			$scope.emailError = false;
			$scope.passwordError = false;
			$scope.usernameError = false;
			$scope.config = {
				email: $scope.email,
				username: $scope.username,
				password: $scope.password,
				confirm: $scope.confirm
			};
			$http({method: 'POST', url: '/signup', data: $scope.config})
				.success(function(data) {
					// Load the profile state
					$state.go(data.redirect, {username: data.params});
				})
				.error(function(err) {
					if (err.signupEmail) {
						$scope.emailError = err.signupEmail[0];
						$scope.email = null;
					}
					else if (err.signupUsername) {
						$scope.usernameError = err.signupUsername[0];
						$scope.username = null;
					}
					else if (err.signupPassword) {
						$scope.passwordError = err.signupPassword[0];
						$scope.password = null;
						$scope.confirm = null;
					}
				});
		};
	}])

	.controller('loginCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		$scope.login = function() {
			$scope.emailError = null;
			$scope.passwordError = null;
			$scope.config = {
				email: $scope.email,
				password: $scope.password
			};
			console.log($scope.config);
			$http({method: 'POST', url: '/login', data: $scope.config})
				.success(function(data) {
					console.log(data);
					$state.go(data.redirect, {username: data.params});
				})
				.error(function(err) {
					console.log("Error: ");
					console.log(err);
					if (err.loginEmail) {
						$scope.emailError = err.loginEmail[0];
						$scope.email = null;
						$scope.password = null;
					}
					else {
						$scope.passwordError = err.loginPassword[0];
						$scope.password = null;
					};
				});
		};
	}])

	.controller('profileCtrl', ['$scope', '$http', '$state', '$stateParams', function($scope, $http, $state, $stateParams) {
		// Fetching user's data for that particular page
		$http({method: 'GET', url: '/userData/' + $stateParams.username})
			.success(function(data) {
				if (!data) $state.go('err');
				else $scope.info = data;
			})
			.error(function() {console.log("Log the FUCK in!")});
	}])

	// !!! Marked for future alterations
	.controller('profileProjectsCtrl', ['$scope', '$state', '$http', '$stateParams', function($scope, $state, $http, $stateParams) {
		console.log($stateParams.username);
		$http({method: 'GET', url: '/allProjects/' + $stateParams.username})
			.success(function(data) {
				console.log(data);
				$scope.projects = data;
				data.forEach(function(data) {
					data.time = moment(data.time).format("MMMM DD, YYYY");
				});
			});
	}])

	.controller('newProjectCtrl', ['$scope', '$http', '$state', '$stateParams', function($scope, $http, $state, $stateParams) {
		$scope.createProject = function() {
			$scope.config = {
				title: $scope.title,
				tagline: $scope.tagline,
				genre: $scope.genre,
				description: $scope.description
			}
			$http({method: 'POST', url:'/project/create', data: $scope.config})
				.success(function(data) {
					// Do this instead of $state.go in order to reload parent state
					$state.transitionTo('profile.projects', $stateParams, {
					    reload: true,
					    inherit: false,
					    notify: true
					});
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.overlay = document.getElementById('large-overlay').getBoundingClientRect();
		// allow us to hit escape to go back to projects page
		document.onkeydown = function(event) {
			if (event.keyCode === 27) $state.go('profile.projects');
		}
		document.getElementById('large-overlay-wrapper').onclick = function(event) {
			// click on the black part to go back
			var rect = $scope.overlay;
			var clickX = event.clientX;
			var clickY = event.clientY;
			if ((clickX < rect.left || clickX > rect.right) && (clickY > rect.top || clickY < rect.bottom)) {	
				$state.go('profile.projects');
			}
		}
	}])

	.controller('exploreCtrl', ['$scope', '$http', function($scope, $http) {
		$http({method: 'GET', url: '/projects/all'})
			.success(function(data) {
				console.log("got all projects");
				$scope.projects = data;
				data.forEach(function(data) {
					data.time = moment(data.time).format("MMMM DD, YYYY");
				});
			})
			.error(function(err) {
				console.log(err);
			});
	}])

	.controller('projectCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
		$scope.id = $stateParams.id;
		$http({method: 'GET', url: '/projectData/' + $stateParams.id})
			.success(function(data) {
				$scope.info = data;
				$scope.moment = moment($scope.info.time).format("MMMM DD YYYY");
				console.log("Project info received");
				$http({method: 'GET', url: '/userId/' + $scope.info.userID})
					.success(function(data) {
						// User that made this project
						$scope.user = data;
					});
			}).
			error(function(err) {
				console.log(err);
			});
	}]);





// Controllers
angular.module('faneronControllers', ['faneronServices', 'ui.router'])

	.controller('navCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		$scope.loggedIn = false;
		$http({method: 'GET', url: '/login/current'})
			.success(function(data) {
				$scope.data = data;
				$scope.loggedIn = true;
			})
			.error(function(err) {
				console.log(err);
				$scope.loggedIn = false;
			});
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

	.controller('profileProjectsCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
		console.log($stateParams.username);
		$http({method: 'GET', url: '/allProjects/' + $stateParams.username})
			.success(function(data) {
				console.log(data);
				$scope.projects = data;
			});
	}])

	.controller('newProjectCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		$scope.createProject = function() {
			$scope.config = {
				title: $scope.title,
				tagline: $scope.tagline,
				genre: $scope.genre,
				description: $scope.description
			}
			console.log($scope.config);
			$http({method: 'POST', url:'/projects', data: $scope.config})
				.success(function(data) {
					console.log('Success!');
					$state.go('profile.projects');
				})
				.error(function(err) {
					console.log(err);
				});
		}
	}])

	.controller('exploreCtrl', ['$scope', '$http', function($scope, $http) {
		$scope.projects = 
			[{
				"title": "SexyProject1",
				"description": "This project is so motherfucking sexy I can't even hold it in right now.",
				"created": "5/13/2014"
			},
			{
				"title": "SexyProject2",
				"description": "This project is so motherfucking sexy I can't even hold it in right now.",
				"created": "5/15/2014"
			},
			{
				"title": "SexyProject3",
				"description": "This project is so motherfucking sexy I can't even hold it in right now.",
				"created": "4/13/2013"
			},
			{
				"title": "SexyProject4",
				"description": "This project is so motherfucking sexy I can't even hold it in right now.",
				"created": "lawl sex"
			}];
	}])

	.controller('projectCtrl', ['$scope', '$http', '$stateParams', function($scope, $http, $stateParams) {
		$scope.id = $stateParams.id;
		$http({method: 'GET', url: '/projectData/' + $stateParams.id})
			.success(function(data) {
				$scope.info = data;
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





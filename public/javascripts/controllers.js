	// Controllers
angular.module('faneronControllers', ['faneronServices', 'ui.router'])

	.controller('navCtrl', ['$scope', '$rootScope', '$http', '$state', function($scope, $rootScope, $http, $state) {
		$rootScope.loggedIn = false;
		$scope.$on('$stateChangeStart', function() {
			$http({method: 'GET', url: '/auth/isAuthenticated'})
			.success(function(data) {
				$rootScope.user = data;
				$rootScope.loggedIn = true;
			})
			.error(function(err) {
				$rootScope.loggedIn = false;
				$rootScope.user = null;
			});
		});
		
		$scope.logout = function() {
			$http({method: 'GET', url: '/auth/logout'})
				.success(function(data) {
					console.log(data);
					$state.go(data.redirect);
				})
				.error(function(err) {
					console.log("couldn't log out");
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
			$http({method: 'POST', url: '/auth/create', data: $scope.config})
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
			$http({method: 'POST', url: '/auth/login', data: $scope.config})
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

	.controller('profileCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
		$scope.loggedInUser = $rootScope.user;
		// Fetching user's data for that particular page
		$http({method: 'GET', url: '/user/get/' + $stateParams.username})
			.success(function(data) {
				if (!data) $state.go('err');
				else $scope.user = data;
			})
			.error(function() {console.log("Log the FUCK in!")});
	}])

	// !!! Marked for future alterations
	.controller('profileProjectsCtrl', ['$scope', '$state', '$http', '$stateParams', function($scope, $state, $http, $stateParams) {
		console.log($stateParams);
		$http({method: 'GET', url: '/user/projects/' + $stateParams.username})
			.success(function(data) {
				console.log(data);
				$scope.projects = data;
				data.forEach(function(data) {
					data.time = moment(data.info.timestamp).format("MMMM DD, YYYY");
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
		$http({method: 'GET', url: '/project/get/all'})
			.success(function(data) {
				console.log("got all projects");
				console.log(data);
				$scope.projects = data;
				data.forEach(function(data) {
					data.time = moment(data.time).format("MMMM DD, YYYY");
				});
			})
			.error(function(err) {
				console.log(err);
			});
	}])

	.controller('projectCtrl', ['$scope', '$http', '$stateParams', '$state', function($scope, $http, $stateParams, $state) {
		$scope.showCommentForm = false;
		$scope.show = function() {
			$scope.showCommentForm = true;
		}
		$http({method: 'GET', url: '/project/get/' + $stateParams.id})
			.success(function(data) {
				$scope.project = data;
				console.log($scope.project);
				$scope.moment = moment($scope.project.info.timestamp).format("MMMM DD YYYY");
				$scope.comments = $scope.project._comments;
				if ($scope.comments) {
					$scope.comments.forEach(function(data) {
						// data.timestamp = moment(data.timeStamp).format("MMMM DD YYYY");
						data.timestamp = moment(data.timestamp).fromNow();
						if (data._replies) {
							data._replies.forEach(function(reply) {
								reply.timestamp = moment(reply.timestamp).fromNow();
							});
						}
						console.log(data);
					});
				}
			}).
			error(function(err) {
				console.log(err);
			});
		$scope.addComment = function() {
			$scope.comment = document.getElementById('comment-box').value;
			console.log($scope.comment);
			var config = {
				project: $scope.project,
				subject: null, 
				comment: $scope.comment,
				original: true
			};
			$http({method: 'POST', url: '/comment/create', data: config})
				.success(function(data) {
					console.log(data);
					$state.transitionTo('project.comments', $stateParams, {
					    reload: true,
					    inherit: false,
					    notify: true
					});
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.up = function(id) {
			$http({method: 'POST', url: '/comment/upvote/' + id})
				.success(function(data) {
					for (var i = 0; i < $scope.comments.length; i++) {
						// Check comments to update view with new score
						if ($scope.comments[i]._id === data._id) {
							$scope.comments[i].vote.votes = data.vote.votes;
							return;
						}
						var replies = $scope.comments[i]._replies;
						// Check replies to update view with new score
						if (replies) {
							for (var j = 0; j < replies.length; j++) {
								if (replies[j]._id === data._id) {
									replies[j].vote.votes = data.vote.votes;
								}
							}
						}
					}
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.down = function(id) {
			$http({method: 'POST', url: '/comment/downvote/' + id})
				.success(function(data) {
					for (var i = 0; i < $scope.comments.length; i++) {
						if ($scope.comments[i]._id === data._id) {
							$scope.comments[i].vote.votes = data.vote.votes;
						}
						var replies = $scope.comments[i]._replies;
						// Check replies to update view with new score
						if (replies) {
							for (var j = 0; j < replies.length; j++) {
								if (replies[j]._id === data._id) {
									replies[j].vote.votes = data.vote.votes;
								}
							}
						}
					}
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.reply = function(id) {
			var config = {
				project: $scope.project,
				subject: null, 
				comment: "reply test",
				original: true
			};

			$http({method: 'POST', url: '/comment/reply/' + id, data: config})
				.success(function(data) {
					console.log(data);
				})
				.error(function(err) {
					console.log(err)
				});
		}
	}]);





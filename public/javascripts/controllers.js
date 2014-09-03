	// Controllers
angular.module('faneronControllers', ['faneronServices', 'ui.router'])

	.factory('updateVotes', [function() {
		// comments = array 
		// update = comment object that we're looking for
		var update = function(comments, to_update) {
			if (comments.length === 0) return false;
			else if (comments[0]._id === to_update._id) {
				comments[0].vote = to_update.vote;
				return true; 
			} else {
				return update(comments.slice(1, comments.length), to_update) || update(comments[0]._replies, to_update);
			}
		}
		return update; 
	}])

	.controller('navCtrl', ['$scope', '$rootScope', '$http', '$state', function($scope, $rootScope, $http, $state) {
		$rootScope.loggedIn = false;
		$scope.$on('$stateChangeStart', function() {
			$http({method: 'GET', url: '/auth/isAuthenticated'})
			.success(function(data) {
				$rootScope.user = data;
				$scope.username = data.info.username;
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
					// want to load controller for the page – use transitionTo with reload: true
					$state.transitionTo(data.redirect, {username: data.params}, {
					    reload: true,
					    inherit: false,
					    notify: true
					});
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

	.controller('profileBioCtrl', ['$scope', '$rootScope', '$http', '$state', '$stateParams', function($scope, $rootScope, $http, $state, $stateParams) {
		console.log("bio controller is loaded");
		$scope.loggedInUser = $rootScope.user;
		$scope.editBioToggled = false;
		$scope.editBio = function() {
			console.log($scope.bio);
			$http({method: 'POST', url: '/user/update/' + $scope.loggedInUser._id, data: {
					bio: $scope.bio
				}})
				.success(function(data) {
					console.log(data);
					$state.transitionTo('profile.bio', $stateParams, {
					    reload: true,
					    inherit: false,
					    notify: true
					});
				})
				.error(function(error) {
					console.log(error);
				});
		}
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

	.controller('projectDescriptionCtrl', ['$scope', '$stateParams', '$state', '$http', function($scope, $stateParams, $state, $http) {
		$scope.toggled = false;
		$scope.update = function() {
			$scope.project = $scope.$parent.project;
			var config = {
				description: $scope.description
			}
			var projectId = $scope.$parent.project._id;
			console.log(projectId);
			$http({method: 'POST', url: '/project/update/' + projectId, data: config})
				.success(function(data) {
					$state.transitionTo('project.description', $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					})
				})
				.error(function(err) {
					console.log(err);
				});
		}
	}])

	.controller('projectGameplayCtrl', ['$scope', '$http', '$state', '$stateParams', function($scope, $http, $state, $stateParams) {
		$scope.toggled = false;
		$scope.update = function() {
			$scope.project = $scope.$parent.project;
			var config = {
				gameplay: $scope.gameplay
			}
			var projectId = $scope.project._id;
			$http({method: 'POST', url: '/project/update/' + projectId, data: config})
				.success(function(data) {
					$state.transitionTo('project.gameplay', $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					})
				})
				.error(function(err) {
					console.log(err);
				});
		}
	}])

	.controller('projectLoreCtrl', ['$scope', '$http', '$state', '$stateParams', function($scope, $http, $state, $stateParams) {
		$scope.toggled = false;
		$scope.update = function() {
			$scope.project = $scope.$parent.project;
			var config = {
				lore: $scope.lore
			}
			console.log(config);
			var projectId = $scope.project._id;
			$http({method: 'POST', url: '/project/update/' + projectId, data: config})
				.success(function(data) {
					$scope.project.info.lore = data; 
				})
				.error(function(err) {
					console.log(err);
				});
		}
	}])

	.controller('projectCommentsCtrl', ['$scope','$rootScope', '$stateParams', '$state', '$http', 'updateVotes', function($scope, $rootScope, $stateParams, $state, $http, updateVotes) {
		$scope.showCommentForm = false;
		$http({method: 'GET', url: '/project/comments/' + $stateParams['id']})
			.success(function(data){
				$scope.comments = data;
				$scope.moment = moment;
			})
			.error(function(err) {
				console.log(err);
			});
		$scope.show = function() {
			$scope.showCommentForm = true;
		}
		$scope.addComment = function() {
			var config = { 
				project: $scope.$parent.project,
				subject: $scope.subject,
				comment: $scope.comment,
				original: true
			};
			console.log(config);
			$http({method: 'POST', url: '/comment/create', data: config})
				.success(function(data) {
					$state.transitionTo('project.comments', $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					})
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.up = function(id) {
			$http({method: 'POST', url: '/comment/upvote/' + id})
				.success(function(data) {
					updateVotes($scope.comments, data);
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.down = function(id) {
			$http({method: 'POST', url: '/comment/downvote/' + id})
				.success(function(data) {
					updateVotes($scope.comments, data);
				})
				.error(function(err) {
					console.log(err);
				});
		}
		$scope.createReply = function(id) {
			console.log("replying");
			var reply = $( "#reply-box" ).val();
			console.log(reply);
			var config = {
				project: $scope.project,
				subject: 'eat blah blah blah', 
				comment: reply, 
				original: true
			};

			$http({method: 'POST', url: '/comment/reply/' + id, data: config})
				.success(function(data) {
					console.log(data);
					$rootScope.replyBoxFor = null;
					$state.transitionTo('project.comments', $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					});
				})
				.error(function(err) {
					console.log(err)
				});
		}
	}])

	.controller('projectImagesCtrl', ['$scope', function($scope) {
		$scope.aws_upload = AWS_S3;

	}])

	.controller('projectCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$state', function($scope, $http, $rootScope, $stateParams, $state) {
		$scope.showCommentForm = false;
		$scope.loggedInUser = $rootScope.user;
		$scope.show = function() {
			$scope.showCommentForm = true;
		}
		$http({method: 'GET', url: '/project/get/' + $stateParams.id})
			.success(function(data) {
				$scope.project = data;
				console.log($scope.project);
			}).
			error(function(err) {
				console.log(err);
			});
	}])
	.controller('commentThreadCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$state', 'updateVotes', function($scope, $http, $rootScope, $stateParams, $state, updateVotes) {
		$scope.loggedInUser = $rootScope.user;
		console.log('comment thread controller loaded');
		$http({method: 'GET', url: '/comment/thread/' + $stateParams.id})
			.success(function(data) {
				console.log(data);
				$scope.comment = data;
				console.log(moment($scope.comment.timestamp).fromNow());
				// Make the moment() function available to angular templates
				$scope.moment = moment;
			})
			.error(function(err) {
				console.log(err);
			});
			
		$scope.up = function(id) {
			$http({method: 'POST', url: '/comment/upvote/' + id})
				.success(function(data) {
					updateVotes([$scope.comment], data);
				})
				.error(function(err) {
					console.log(err);
				});
		}

		$scope.down = function(id) {
			$http({method: 'POST', url: '/comment/downvote/' + id})
				.success(function(data) {
					updateVotes([$scope.comment], data);
				})
				.error(function(err) {
					console.log(err);
				});
		}

		$scope.createReply = function(id) {
			// Have to make an random project object for the route to use
			// project._id
			var project = {
				_id: $scope.comment._project._id
			}
			var config = {
				project: project,
				subject: 'eat blah blah blah', 
				comment: $('#reply-box').val(),
				original: true
			};

			$http({method: 'POST', url: '/comment/reply/' + id, data: config})
				.success(function(data) {
					console.log(data);
					$rootScope.replyBoxFor = false;
					$state.transitionTo('comment_thread', $stateParams, {
						reload: true,
						inherit: false,
						notify: true
					});

				})
				.error(function(err) {
					console.log(err)
				});
		}

	}]);





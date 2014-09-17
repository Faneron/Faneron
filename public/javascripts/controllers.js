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
				console.log($scope.user);
				if ($scope.user.profile) $('.crop-box').css("background-image", "url('" + $scope.user.profile + "')");
				else $('.crop-box').css("background-image", "url('/images/Logo 1.jpg')");
				if ($scope.user.cover) $('#cover-wrapper').css("background-image", "url('" + $scope.user.cover + "')");
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
	.controller('profileProjectsCtrl', ['$scope', '$state', '$http', '$stateParams', '$timeout', function($scope, $state, $http, $stateParams, $timeout) {
		$http({method: 'GET', url: '/user/projects/' + $stateParams.username})
			.success(function(data) {
				$scope.projects = data;
				data.forEach(function(data) {
					data.time = moment(data.info.timestamp).format("MMMM DD, YYYY");
				});
			});

	}])

	.controller('profileArtCtrl', ['$scope', function($scope) {
		$scope.toggleGrid = function() {
			var cards = $('.image-card')
			if (!$scope.gridToggled) {
				$scope.gridToggled = true;
				cards.addClass('grid');
				$('#image-container')
					.css('margin-bottom', "10px")
					.masonry({itemSelector: '.image-card', gutter: 0});
			} else {
				$scope.gridToggled = false;
				cards.removeClass('grid');
				$('#image-container')
					.css('margin-bottom', '-20px')
					.masonry('destroy');
			}
		}

	}])

	.controller('newProjectCtrl', ['$scope', '$http', '$state', '$stateParams', '$rootScope', function($scope, $http, $state, $stateParams, $rootScope) {
		$scope.createProject = function() {
			$scope.config = {
				title: $scope.title,
				tagline: $scope.tagline,
				genre: $scope.genre,
				description: $scope.description
			}
			$http({method: 'POST', url:'/project/create', data: $scope.config})
				.success(function(data) {
					console.log($rootScope.user);
					console.log(data);
					$state.go('project', {id: data._id});
				})
				.error(function(err) {
					console.log(err);
				});
		}
	}])

	.controller('exploreCtrl', ['$scope', '$http', '$location', '$rootScope', '$state', function($scope, $http, $location, $rootScope, $state) {
		$scope.loggedInUser = $rootScope.user;
		var $container = $('#explore-container');
		// max number of pages to the left and right of the current page number
		$scope.limit = 2;
		$scope.getProjects = function() {
			var query = $location.search();
			var keys = Object.keys(query);
			var dateIndex = keys.indexOf('date');
			if (dateIndex != -1) keys.splice(dateIndex, 1);
			var sortIndex = keys.indexOf('sort');
			if (sortIndex != -1) keys.splice(sortIndex, 1);
			var pageIndex = keys.indexOf('page');
			if (pageIndex != -1) {
				$scope.pageNumber = parseInt(query.page);
				keys.splice(pageIndex, 1);
			}			
			// get object keys
			console.log(keys);
			for (key in query) {
				if (query.hasOwnProperty(key)) {
					if (query[key] === 'true') $scope[key] = true;
					else $scope[key] = query[key];
				}
			}

			if (!$scope.pageNumber) $scope.pageNumber = 0;

			// set defaults if no query value given
			if (!$scope.date) $scope.date = 'today';
			if (!$scope.sort) $scope.sort = 'vote.votes';

			$http({method: 'GET', url: '/project/get/all', params: {genre: keys, date: $scope.date, sort: $scope.sort, 'skip': $scope.pageNumber}})
				.success(function(data) {
					console.log("got all projects");
					$scope.projects = data.projects;
					$scope.count = data.count;
					$scope.pages = Math.ceil(data.count/20);
					$scope.range = function(n) {
						return new Array(n);
					}
					console.log($scope.pages);
					console.log(data);
					data.projects.forEach(function(data) {
						data.time = moment(data.info.timestamp).format("MMMM DD, YYYY");
					});
					/*setTimeout(function() {
						$container.masonry({
							itemSelector: '.explore-project-card',
							gutter: 20
						});
					}, 150);*/
				})
				.error(function(err) {
					console.log(err);
				});

		}

		$scope.getProjects();
	
		$scope.updateQuery = function(key, value) {
			$container.masonry('destroy');
			$scope.projects = null;
			if (!$scope[key]) {
				$location.search(key, null);
			}
			else {
				$location.search(key, $scope[key]);
			}
			$scope.getProjects();
		}

		$scope.changePage = function(page) {
			if (page !== $scope.pageNumber && page < $scope.pages && page >= 0) {
				$container.masonry('destroy');
				$scope.projects = null;
				$location.search('page', page);
				$scope.getProjects();
			}
		}

		$scope.upvote = function(project) {
			$http({method: 'POST', url: '/project/upvote/' + project._id})
				.success(function(data) {
					project.vote = data.vote;
				})
				.error(function(err) {
					console.log(err);
				});
		}

		$scope.downvote = function(project) {
			$http({method: 'POST', url: '/project/downvote/' + project._id})
				.success(function(data) {
					project.vote = data.vote;
				})
				.error(function(err) {
					console.log(err);
				});
		}

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

	.controller('projectImagesCtrl', ['$scope', '$stateParams', function($scope, $stateParams) {
		$scope.project_id = $stateParams.id;
		console.log($scope.project_id);
		$scope.toggleGrid = function() {
			var cards = $('.image-card')
			if (!$scope.gridToggled) {
				$scope.gridToggled = true;
				cards.addClass('grid');
				$('#image-container')
					.css('margin-bottom', "10px")
					.masonry({itemSelector: '.image-card', gutter: 0});
			} else {
				$scope.gridToggled = false;
				cards.removeClass('grid');
				$('#image-container')
					.css('margin-bottom', '-20px')
					.masonry('destroy');
			}
		}
	}])

	.controller('projectCtrl', ['$scope', '$http', '$rootScope', '$stateParams', '$state', function($scope, $http, $rootScope, $stateParams, $state) {
		var cover = $("#cover-wrapper");
		$scope.showCommentForm = false;
		$scope.loggedInUser = $rootScope.user;
		$scope.show = function() {
			$scope.showCommentForm = true;
		}
		$http({method: 'GET', url: '/project/get/' + $stateParams.id})
			.success(function(data) {
				$scope.project = data;
				$scope.moment = moment($scope.project.info.timestamp).format("MMMM DD, YYYY");
				cover.css("background-image", "url('" + $scope.project.coverImage + "')");
				console.log(cover);
			}).
			error(function(err) {
				console.log(err);
				$state.go('err');
			});
		$scope.upvote = function() {
			$http({method: 'POST', url: '/project/upvote/' + $stateParams.id})
				.success(function(data) {
					$scope.project.vote = data.vote;
				})
				.error(function(err) {
					console.log(err);
				});
		};
		$scope.downvote = function() {
			$http({method: 'POST', url: '/project/downvote/' + $stateParams.id})
				.success(function(data) {
					$scope.project.vote = data.vote;
				})
				.error(function(err) {
					console.log(err);
				});
		}
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





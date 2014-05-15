// Controllers
angular.module('faneronControllers', ['faneronServices', 'ui.router'])
	
	.controller('signupCtrl', ['$scope', '$http', '$state', function($scope, $http, $state){
		// Waiting for http post route to create a user
		$scope.signup = function() {
			$scope.config = {
				email: $scope.email,
				username: $scope.username,
				password: $scope.password,
				confirm: $scope.confirm
			};
			$http({method: 'POST', url: '/users', data: $scope.config})
				.success(function(data) {
					console.log(data);
					// Load the profile state
					$state.go('profile');
				})
				.error(function(err) {console.log(err)});
		};
	}])

	.controller('profileCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
		// Fetching dummy data for now
		$http({method: 'GET', url: '/userData'})
			.success(function(data) {
				$scope.info=data;
				console.log(data);
			})
			.error(function() {console.log('No')});
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
		// Dummy data (will pull from mongo later on)
		$scope.user = {
			"name": "Quan Nguyen",
			"username": "macomac",
			"followers": 2561,
			"id": 23
		};
		$scope.project = {
			"id": 5,
			"title": "Quanville",
			"description": "Much sexy gameplay for great justice of farming and quan business work project lemons and dandelion seed pokemon master.",
			"cover_image_id": 13,
			"genres": ["open world", "farm orgy"]
		};
		$scope.id = $stateParams.id;
	}]);





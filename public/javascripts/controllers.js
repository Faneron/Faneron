// Controllers
angular.module('faneronControllers', ['faneronServices'])
	
	.controller('signupCtrl', ['$scope', 'UserService', function($scope, UserService){
		$scope.config = {
			email: $scope.email,
			username: $scope.username,
			password: $scope.password,
			confirm: $scope.confirm
		}
	}])

	.controller('profileCtrl', ['$scope', '$http', function($scope, $http) {
		$http({method: 'GET', url: '/userData'})
			.success(function(data) {$scope.info=data; console.log(data);})
			.error(function() {console.log('No')});
		// random placeholder
		$scope.blah = 'blah!';
	}]);
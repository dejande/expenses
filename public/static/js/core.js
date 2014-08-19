

var expensesApp = angular.module('expensesApp', ['ngRoute']);

expensesApp.config(['$routeProvider',

	function($routeProvider) {

		$routeProvider.when('/', {
			templateUrl: 'view.html',
			controller: 'mainCtrl'
		}).
		when('/name/:name', {
			templateUrl: 'view.html',
			controller: 'mainCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
	}]);

expensesApp.controller('mainCtrl', function($scope, $http, $routeParams){
	$scope.expense = {};
	$scope.result = {display: false};
	$scope.disableSave = false;
	$scope.name = $routeParams.name;
	$scope.expense.name = $scope.name;

	var newDate = new Date();
	$scope.expense.day = newDate.getDate();
	$scope.expense.month = newDate.getMonth() + 1;
	$scope.expense.year = newDate.getFullYear();

	$scope.clean = function() {
		$scope.result.display = false;
	};

	$scope.save = function() {
		$scope.expense.datePaid = $scope.expense.year + "-" + $scope.expense.month + "-" + $scope.expense.day + " 00:00:00";
		$scope.disableSave = true;

		$http.post('/api/expense', $scope.expense).success(function(data) {
			delete $scope.expense.price;
			delete $scope.expense.type;
			// console.log(data);
			$scope.result.display = true;
			$scope.result.success = true;
			$scope.disableSave = false;
			$scope.result.message = data.message;

		}).error(function(data) {
			// console.log('Error: ' + data);
			$scope.result.display = true;
			$scope.result.success = false;
			$scope.disableSave = false;
			$scope.result.message = data.message;
		});
	};
});

expensesApp.filter('range', function() {

	return function(input, min, max) {
		min = parseInt(min); //Make string input int
		max = parseInt(max);

		for (var i=min; i<max; i++)
			input.push(i);

		return input;
	};
});
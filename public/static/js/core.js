

var expensesApp = angular.module('expensesApp', ['ngRoute']);

expensesApp.config(['$routeProvider',

	function($routeProvider) {

		$routeProvider.
		when('/', {
			templateUrl: 'create.html',
			controller: 'mainCtrl'
		}).
		when('/name/:name', {
			templateUrl: 'create.html',
			controller: 'mainCtrl'
		}).
		when('/view/:view', {
			templateUrl: 'view.html',
			controller: 'viewCtrl'
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);

expensesApp.controller('mainCtrl', function($scope, $http, $routeParams, $timeout){
	$scope.expense = {};
	$scope.result = {display: false};
	$scope.name = $routeParams.name;
	$scope.expense.name = $scope.name;

	var newDate = new Date();
	$scope.expense.day = newDate.getDate();
	$scope.expense.month = newDate.getMonth() + 1;
	$scope.expense.year = newDate.getFullYear();

	$scope.closeAlert = function() {
		$scope.result.display = false;
	};

	$scope.clean = function() {
		$scope.result.display = false;
	};

	$scope.save = function() {
		$scope.expense.datePaid = $scope.expense.year + "-" + $scope.expense.month + "-" + $scope.expense.day + " 12:00:00";

		$http.post('/api/expense', $scope.expense).success(function(data) {
			delete $scope.expense.price;
			$scope.result.display = true;
			$scope.result.success = true;
			$scope.result.message = data.message;
			$('#expenseInput').focus();
			$timeout(function() {$scope.closeAlert();}, alertTimeout);

		}).error(function(data) {
			$scope.result.display = true;
			$scope.result.success = false;
			$scope.result.message = data.message;
		});
	};
});

expensesApp.controller('viewCtrl', function($scope, $http, $routeParams, $timeout){
	$scope.expenses = [];
	$scope.header = {
		'datePaid': 'Date',
		'name': 'Name',
		'price': 'Price',
		'description': 'Description'
	};

	$http.get('/api/expense/' + $routeParams.view).success(function(data) {
		$scope.expenses = data;
	});
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

expensesApp.filter('parseTime', function() {

	return function(input) {
		var dateParts = [];

		if(input !== undefined) {
			dateParts = input.split("T");
		}

		return dateParts[0];
	};
});
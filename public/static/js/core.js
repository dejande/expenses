

var expensesApp = angular.module('expensesApp', ['ngRoute', 'nvd3']);

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
		when('/plot/:plot', {
			templateUrl: 'plot.html',
			controller: 'plotCtrl'
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
			$scope.result.message = data;
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

expensesApp.controller('plotCtrl', function($scope, $http){
	$scope.types = [{name: 'type', value: "Po tipu"}, {name: 'person', value: "Po osebi"}];
	$scope.type = "type";
	$scope.data = [];

	$scope.redraw = function() {
		$scope.data = [];

		if($scope.type === "type") {
			$scope.getByType();

		}else {
			$scope.getByPerson();
		}
	};

	$scope.options = {
        chart: {
            type: 'lineChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 65
            },
            x: function(d){ return getValue(d); },
            y: function(d){ return d.price; },
            average: function(d) { return d.mean; },

            color: d3.scale.category10().range(),
            transitionDuration: 300,
            useInteractiveGuideline: true,
            clipVoronoi: false,

            xAxis: {
                axisLabel: 'X Axis',
                tickFormat: function(d) {
                    return d3.time.format('%d/%m/%y')(new Date(d));
                },
                showMaxMin: false,
                axisLabelDistance: 20
            },

            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 20
            }
        }
    };

    $scope.getByType = function(){

	    $http.get('/api/plot/type/Stanovanje').success(function(data) {
			$scope.data.push({
				key: "Stanovanje",
				values: data,
				mean: getAvg(data, 'price')
			});
		});

	    $http.get('/api/plot/type/Ostalo').success(function(data) {
			$scope.data.push({
				key: "Ostalo",
				values: data,
				mean: getAvg(data, 'price')
			});
		});

	    $http.get('/api/plot/type/Avto').success(function(data) {
			$scope.data.push({
				key: "Avto",
				values: data,
				mean: getAvg(data, 'price')
			});
		});

	    $http.get('/api/plot/type/Poroka').success(function(data) {
			$scope.data.push({
				key: "Poroka",
				values: data,
				mean: getAvg(data, 'price')
			});
		});

	    $http.get('/api/plot/type/Hrana').success(function(data) {
			$scope.data.push({
				key: "Hrana",
				values: data,
				mean: getAvg(data, 'price')
			});
		});
	};

    $scope.getByPerson = function(){

	    $http.get('/api/plot/person/Dejan').success(function(data) {
			$scope.data.push({
				key: "Dejan",
				values: data,
				mean: getAvg(data, 'price')
			});
		});

	    $http.get('/api/plot/person/Katarina').success(function(data) {
			$scope.data.push({
				key: "Katarina",
				values: data,
				mean: getAvg(data, 'price')
			});
		});
	};

	$scope.getByType();
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
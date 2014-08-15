// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express		= require('express'); 		// call express
var app			= express(); 				// define our app using express
var bodyParser	= require('body-parser');
var Sequelize	= require("sequelize");
var credentials = require("./credentials");

var sequelize = new Sequelize(credentials.database, credentials.username, credentials.password);
var Expense = sequelize.import('./models/expense');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

var port = process.env.PORT || 8080; 		// set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router(); 				// get an instance of the express Router

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// Create expense
router.route('/expense').post(function(req, res) {
	var expense = Expense.create({
		price: req.body.price,
		name: req.body.name,
		type: req.body.type,
		description: req.body.desc,
		datePaid: req.body.datePaid

	}).success(function(task) {
		res.json({message: 'Expense created!'});

	}).error(function(error) {
		res.json({message: 'Expense not created: ' + error});
	});

// Get all expenses
}).get(function(req, res) {

	Expense.findAll({order: 'datePaid'}).success(function(results) {
		res.json(results);

	}).error(function(error) {
		res.json({message: 'Could not fetch expenses!'});
	});
});

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server on port ' + port);

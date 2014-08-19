var Sequelize = require("sequelize");
var credentials = require("../credentials");

var sequelize = new Sequelize(credentials.database, credentials.username, credentials.password);

var Expense = sequelize.define('expense', {
	price: Sequelize.DECIMAL(10,3),
	name: Sequelize.STRING,
	type: Sequelize.STRING,
	datePaid: {type: Sequelize.DATE, defaultValue: Sequelize.NOW},
	description: Sequelize.TEXT
});

// Sync db
// sequelize.drop();
// sequelize.sync({force: true});

module.exports = function() {
	return Expense;
};
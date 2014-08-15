var Sequelize = require("sequelize");

var sequelize = new Sequelize('expenses', 'expenses', 'expenses');

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
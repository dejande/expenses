
module.exports = function(sequelize, DataTypes) {

	var Expense = sequelize.define('expense', {
		price: DataTypes.DECIMAL(10,3),
		name: DataTypes.STRING,
		type: DataTypes.STRING,
		datePaid: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
		description: DataTypes.TEXT
	},{
		getterMethods: {
			monthPaid: function() {
				console.log(new Date(Date.parse(this.datePaid)).toString());
				var date = new Date(Date.parse(this.datePaid));

				var y = date.getFullYear();
				var m = date.getMonth();
				var d = 3;
				return new Date(y, m, d);
			}
		}
	});

	return Expense;
};

module.exports = function(sequelize, DataTypes) {

	return sequelize.define('expense', {
		price: DataTypes.DECIMAL(10,3),
		name: DataTypes.STRING,
		type: DataTypes.STRING,
		datePaid: {type: DataTypes.DATE, defaultValue: DataTypes.NOW},
		description: DataTypes.TEXT
	});
};
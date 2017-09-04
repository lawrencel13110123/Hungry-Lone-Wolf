module.exports = function(sequelize, DataTypes) {
	var plan = sequelize.define("plan", {
		match_id: {
			type: DataTypes.INTEGER, 
			allowNull: false
		}, 
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false
		},
		meal: {
			type: DataTypes.STRING, 
			allowNull: false 
		},
		cuisine: {
			type: DataTypes.STRING, 
			allowNull: false 
		},
		price: {
			type: DataTypes.STRING, 
			allowNull: false 
		}   
	});

	plan.associate = function(models) {
		plan.belongsTo(models.user, {
			foreignKey: {
				allowNull: false
			}
		});
	};

	return plan;
};
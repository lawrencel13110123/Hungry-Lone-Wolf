module.exports = function(sequelize, DataTypes) {
	var response = sequelize.define("response", {
		date: {
			type: DataTypes.DATE,
			allowNull: false
		},
		location: {
			type: DataTypes.STRING,
			allowNull: false
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: false
		},
		age: {
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

	response.associate = function(models) {
		response.belongsTo(models.user, {
			foreignKey: {
				allowNull: false
			}
		});
	};

	return response;
};
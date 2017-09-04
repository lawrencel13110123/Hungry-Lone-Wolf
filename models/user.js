module.exports = function(sequelize, DataTypes) {
	var user = sequelize.define("user", {
		first_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false, 
			validate: {
				isEmail: true
			}
		},
		about: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		image: {
			type: DataTypes.STRING,
			allowNull: false, 
			validate: {
				isUrl: true
			}
		},
		age: {
			type: DataTypes.STRING,
			allowNull: false
		},
		gender: {
			type: DataTypes.STRING,
			allowNull: false
		},
		// phone: {
		// 	type: DataTypes.STRING,
		// 	allowNull: false
		// },
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	});

	user.associate = function(models) {
		user.hasMany(models.plan, {
			onDelete: "CASCADE"
		});
	};

	user.associate = function(models) {
		user.hasMany(models.response, {
			onDelete: "CASCADE"
		});
	};

	return user;
};
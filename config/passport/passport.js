// For securing passwords
var bCrypt = require("bcrypt-nodejs");

module.exports = function(passport, user) {

	// Initialize the 'user' model
	var User = user;

	// Initialize the 'passport-local' strategy
	var LocalStrategy = require("passport-local").Strategy;

	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		// Retreive the user
		user.findById(id).then(function(user) {
			// If successful, an instance of the Sequelize model is returned
			if (user) {
				done(null, user.get());
			} else {
				done(user.errors, null);
			}
		});
	})

	// Define custom strategy with instance of LocalStrategy
	passport.use("local-signup", new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},

		// Callback function
		function(req, email, password, done) {
			// Function for hashing password
			var generateHash = function(password) {
				// Explanation for bCrypt.hashSync(arg1, arg2, arg3)
				// First argument is the data to be encrypted
				// Second argument is the salt to be used in encryption where the argument passed to genSaltSync is the number of rounds to process the data for
				// Third argument is the callback to be fired once the data is encrypted
				return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
			};

			// Check to see whether the user already exists in 'user' model
			User.findOne({
				where: {
					email: email
				}
			}).then(function(user) {
				// If the user already exists in the 'user' model
				if (user) {
					// Explanation for req.flash(arg1, arg2)
					// First argument is the type of the message
					// Second argument is the actual message
					return done(null, false, {message: "That email is already taken."});
					// return done(null, false, req.flash("signupMessage", "That email is already taken."));
				// If the user does not exist in the 'user' model
				} else {
					// Create a hash version of the user's password
					var userPassword = generateHash(password);
					var data = {
						email: email,
						password: userPassword,
						first_name: req.body.first_name,
						last_name: req.body.last_name,
						image: req.body.image,
						about: req.body.about,
						age: req.body.age,
						gender: req.body.gender,
						phone: req.body.phone
					};
					console.log(data);
					// Create a user with the hash password and other user information
					User.create(data).then(function(newUser, created) {
						if (!newUser) {
							return done(null, false);
						}
						if (newUser) {
							return done(null, newUser);
						}
					});
				}
			});
		}
	));

	passport.use("local-signin", new LocalStrategy(
		{
			usernameField: "email",
			passwordField: "password",
			passReqToCallback: true // allows us to pass back the entire request to the callback
		},

		// Callback function
		function(req, email, password, done) {
			// Function for checking whether user input's password matches the actual password
			var isValidPassword = function(userpass, password) {
				return bCrypt.compareSync(password, userpass);
			};

			User.findOne({
				where: {
					email: email
				}
			}).then(function(user) {
				if (!user) {
					return done(null, false, {message: "Email does not exist."});
					// return done(null, false, req.flash("loginMessage", "Email does not exist."));
				}
				if (!isValidPassword(user.password, password)) {
					return done(null, false, {message: "Incorrect password."});
					// return done(null, false, req.flash("loginMessage", "Incorrect password."));
				}
				var userinfo = user.get();
				return done(null, userinfo);
			}).catch(function(err) {
				return done(null, false, {message: "Something went wrong with your login."});
				// return done(null, false, req.flash("loginMessage", "Something went wrong with your login."));
			});
		}
	));

};
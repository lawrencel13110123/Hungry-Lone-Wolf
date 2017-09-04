var express = require("express");
var router = express.Router();
var passport = require("passport");
var sequelize = require("sequelize");

var db = require("../models");

router.get("/", function(req, res) {
	res.render("landing");
});

router.get("/signup", function(req, res) {
	res.render("signup");
});

router.get("/login", function(req, res) {
	res.render("login");
});

router.post("/signup", 
	passport.authenticate("local-signup", {
		successRedirect: "/home",
		failureRedirect: "/signup"
	})
);

router.post("/login",
	passport.authenticate("local-signin", {
		successRedirect: "/home",
		failureRedirect: "/login"
	})
);

router.get("/home", isLoggedIn, function(req, res) {
	var potentialPlans = [];
	var potential = false;
	var i = 0;

	var pastPlans = [];
	var past = false;
	var j = 0;

	function display() {
		if (potential && past) {
			res.render("home", {
				potential: potentialPlans,
				past: pastPlans
			});
		}
	};

	function potentialLoop(arr) {
		console.log("Count: " + i);
		if (i < arr.length) {
			var info = {};
			info.plan = arr[i];
			db.user.findAll({
				where: {
					id: arr[i].match_id
				}
			}).then(function(match) {
				info.match = match[0];
				potentialPlans.push(info);
				i++;
				potentialLoop(arr);
			})
		} else {
			console.log("----------------------");
			console.log("All Potential Plans");
			console.log("----------------------");
			console.log(potentialPlans);
			potential = true;
			display();
		}	
	};

	function pastLoop(arr) {
		console.log("Count: " + j);
		if (j < arr.length) {
			var info = {};
			info.plan = arr[j];
			db.user.findAll({
				where: {
					id: arr[j].match_id
				}
			}).then(function(match) {
				info.match = match[0];
				pastPlans.push(info);
				j++;
				pastLoop(arr);
			})
		} else {
			console.log("----------------------");
			console.log("All Past Plans");
			console.log("----------------------");
			console.log(pastPlans);
			past = true;
			display();
		}
	};

	db.plan.findAll({
		where: {
			userId: req.user.id,
			date: {
				$gte: new Date()
			}
		},
		include: [ db.user ]
	}).then(function(plans) {
		potentialLoop(plans);
	});

	db.plan.findAll({
		where: {
			userId: req.user.id,
			date: {
				$lte: new Date()
			}
		},
		include: [ db.user ]
	}).then(function(plans) {
		pastLoop(plans);
	});


});

router.get("/logout", function(req, res) {
	req.session.destroy(function(err) {
		res.redirect("/");
	});
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		res.redirect("/");
	}
};

router.post("/home", isLoggedIn, function(req, res) {
	console.log("------------------------");
	console.log("Received Post Request");
	console.log("------------------------");
	console.log("User ID: " + req.user.id);
	console.log("Survey Answers: ", req.body);
	db.response.create({
		date: req.body.date,
		location: req.body.location,
		gender: req.body.gender,
		age: req.body.age,
		meal: req.body.meal,
		cuisine: req.body.cuisine.toString(),
		price: req.body.price,
		userId: req.user.id
	}).then(function(user) {
		console.log("------------------------");
		console.log("Survey Gender Preference");
		console.log("------------------------");
		console.log(user.gender)
		console.log("------------------------");
		console.log("Survey Cuisine Preferences");
		console.log("------------------------");
		var cuisinePreferences = user.cuisine.split(",");
		console.log(cuisinePreferences);
		// If the survey response for gender is "no preference"
		if (user.gender === "No Preference") {
			console.log("Executing no preference.....");
			// Find all the users (that is not the user themselves) where date, location, age, meal, and price range are exact matches
			db.response.findAll({
				where: {
					userId: {
						$not: user.userId
					},
					date: user.date,
					location: user.location,
					meal: user.meal,
					price: user.price
				}, 
				include: [{
					model: db.user,
					where: {
						age: user.age
					}
				}]
			}).then(function(choices) {
				var possibleMatches = [];
				console.log("---------------------------------------");
				console.log("All Possible Matches (for preference)");
				console.log("---------------------------------------");
				console.log("Choices: ", choices);
				if (choices.length === 0) {
					console.log("no choices...");
					res.send(false);
				} else {
					console.log("available user choices...");
					console.log("---------------------------------------");
					console.log("My Cuisine Preferences ", cuisinePreferences);
					console.log("---------------------------------------");
					choices.forEach(function(choice) {
						console.log(choice);
						var splitCuisines = choice.cuisine.split(",");
						splitCuisines.forEach(function(cuisine) {
							if (cuisinePreferences.indexOf(cuisine) >= 0) {
								possibleMatches.push(choice);
							}
						})
					});

					console.log("-------------------------------------------");
					console.log("All Possible Matches (after cuisine filter)");
					console.log("Number of Possible Matches: " + possibleMatches.length);
					console.log("-------------------------------------------");
					// After this step, possibleMatches should have weighed details

					console.log(possibleMatches);

					var randomNumber = Math.floor(Math.random() * possibleMatches.length); 
					var selected = possibleMatches[randomNumber]; 
					console.log("Random Number Selected: " + randomNumber);
					console.log("Person Selected: ", selected);

					var mealBuddy = {};
					db.plan.create({
						match_id: selected.user.id,
						date: selected.date,
						location: selected.location,
						meal: selected.meal,
						cuisine: selected.cuisine,
						price: selected.price,
						userId: req.user.id
					}).then(function(data) {
						mealBuddy.plan = data;
						db.user.findAll({
							where: {
								id: data.match_id
							}
						}).then(function(match) {
							console.log(match[0]);
							mealBuddy.match = match[0];
							console.log("------------------------");
							console.log("Meal Buddy Sent!");
							console.log("------------------------");
							console.log(mealBuddy);
							res.send(mealBuddy);
						});
					})
				}
			})
		// If the survey response for gender is either "female" or "male"
		} else {
			console.log("Executing preference.....");
			db.response.findAll({
				where: {
					userId: {
						$not: user.userId
					},
					date: user.date,
					location: user.location,
					meal: user.meal,
					price: user.price
				},
				include: [{
					model: db.user,
					where: {
						gender: user.gender,
						age: user.age
					}
				}]
			}).then(function(choices) {
				var possibleMatches = [];
				console.log("---------------------------------------");
				console.log("All Possible Matches (for preference)");
				console.log("---------------------------------------");
				console.log("Choices: ", choices);
				if (choices.length === 0) {
					console.log("no choices...");
					res.send(false);
				} else {
					console.log("available user choices...");
					console.log("---------------------------------------");
					console.log("My Cuisine Preferences ", cuisinePreferences);
					console.log("---------------------------------------");
					choices.forEach(function(choice) {
						console.log(choice);
						var splitCuisines = choice.cuisine.split(",");
						splitCuisines.forEach(function(cuisine) {
							if (cuisinePreferences.indexOf(cuisine) >= 0) {
								possibleMatches.push(choice);
							}
						})
					});

					console.log("-------------------------------------------");
					console.log("All Possible Matches (after cuisine filter)");
					console.log("Number of Possible Matches: " + possibleMatches.length);
					console.log("-------------------------------------------");
					// After this step, possibleMatches should have weighed details

					console.log(possibleMatches);

					var randomNumber = Math.floor(Math.random() * possibleMatches.length); 
					var selected = possibleMatches[randomNumber]; 
					console.log("Random Number Selected: " + randomNumber);
					console.log("Person Selected: ", selected);

					var mealBuddy = {};
					db.plan.create({
						match_id: selected.user.id,
						date: selected.date,
						location: selected.location,
						meal: selected.meal,
						cuisine: selected.cuisine,
						price: selected.price,
						userId: req.user.id
					}).then(function(data) {
						mealBuddy.plan = data;
						db.user.findAll({
							where: {
								id: data.match_id
							}
						}).then(function(match) {
							console.log(match[0]);
							mealBuddy.match = match[0];
							console.log("------------------------");
							console.log("Meal Buddy Sent!");
							console.log("------------------------");
							console.log(mealBuddy);
							res.send(mealBuddy);
						});
					})
				}
			});
		}
	})
});

module.exports = router;

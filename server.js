// Use Express to initialize server
var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

// Require our models for syncing
var db = require("./models");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// To enable overriding POST method with PUT and DELETE methods
var methodOverride = require("method-override");
app.use(methodOverride("_method"));

// Access static files 
var path = require("path");
app.use("/static", express.static(path.join(__dirname, "/public")));

// Initialize Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Format date in Handlebars
var handlebars = require("handlebars");
handlebars.registerHelper("date", require("helper-date"));
handlebars.registerHelper("split", function(str) {
	return str.split(",").join(", ");
});

// Initialize Passport and session for authentication  
var passport = require("passport");
var session = require("express-session");
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

// Allow flash messages when using Passport
var flash = require("connect-flash");
app.use(flash());

// Import the Passport strategies
require("./config/passport/passport.js")(passport, db.user);

// Import routes and allow server to access them
var routes = require("./controllers/routes");
app.use("/", routes);

// Sync database
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log("Listening on PORT " + PORT);
	});
});
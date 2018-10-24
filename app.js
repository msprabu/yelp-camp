var express = require("express");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var app=express();
var bodyParser = require("body-parser");
var methodOverride= require("method-override");

var camp = require("./models/campground");
var User = require("./models/user");
var comment = require("./models/comment");

var commentsRoute = require("./routes/comments");
var campRoute = require("./routes/campgrounds");
var indexRoute = require("./routes/index");

mongoose.connect("mongodb://localhost:27017/YelpCamp", { useNewUrlParser: true });

app.use(require("express-session")({secret: "This is the yelpcamp page",
 							resave: false,
 							saveUninitialized: false}));
//Passport Config
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.set("view engine","ejs");
app.use(methodOverride("_method"));

app.use(function(req, res, next){
	
  	res.locals.currentUser = req.user;
  	next();
  		
  });

app.use(indexRoute);
app.use("/camps/:id/comment",commentsRoute);
app.use("/camps",campRoute);

app.listen("3000", function(){
	console.log("YelpCamp Server Started");
});
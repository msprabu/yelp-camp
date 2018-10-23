var express = require("express");
var router = express.Router();
var middleware = require("../middleware");
var camp = require("../models/campground");

router.get("/", function(req,res){

camp.find({},function(err, allCamps){
if (!err){
res.render("Campgrounds/index",{camps:allCamps});
}else{
console.log("Error while fetching all camps from DB");
}

});

});

router.get("/new", middleware.isLoggedIn,function(req,res){
res.render("Campgrounds/new");

});

router.post("/", middleware.isLoggedIn, function(req,res){

	var name = req.body.campName;
	var url = req.body.imageUrl;
	var thisCreator = {id: req.user._id, username: req.user.username};

	var campItem  = {campName: name, imageUrl: url, creator: thisCreator};

	camp.create(campItem, function(err, createdItem){
			if (!err){
				console.log(createdItem);
				res.redirect("/camps");
			}else{
				console.log("Error while creating new item!");
			}
	});

});


router.get("/:id/edit",middleware.checkCampOwnership, function(req,res){

camp.findById(req.params.id, function(err, foundCamp){

if(!err){
res.render("Campgrounds/edit",{thisCamp:foundCamp});

}else{

}

});

});


router.put("/:id",middleware.checkCampOwnership, function(req,res){

camp.findByIdAndUpdate(req.params.id, req.body.campObj, function(err,updatedItem){

	if (!err){
res.redirect("/camps/"+req.params.id);
} else{

}

});

});

router.delete("/:id",middleware.checkCampOwnership, function(req,res){

camp.findByIdAndRemove(req.params.id,function(err,deletedCamp){

if (!err){
	res.redirect("/camps");
}else{

}

});


});

router.get("/:id",function(req,res){

camp.findById(req.params.id).populate("comments").exec(function(err,foundCamp){

if (!err){
console.log(foundCamp);
res.render("Campgrounds/show",{thisCamp:foundCamp});
} else{

}

});

});

module.exports = router;
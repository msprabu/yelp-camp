var express = require("express");
var router = express.Router({mergeParams: true});
var middleware = require("../middleware");
var camp = require("../models/campground");
var comment = require("../models/comment");


router.get("/new",middleware.isLoggedIn, function(req,res){

camp.findById(req.params.id, function(err,foundCamp){
		res.render("Comments/new", {thisCamp:foundCamp});
	});

});

router.post("/new",middleware.isLoggedIn, function(req,res){

	camp.findById(req.params.id,function(err,foundCamp){
		if (!err){
			comment.create(req.body.comment, function(err, createdComment){
				if (!err){
					createdComment.author.id = req.user._id;
					createdComment.author.username = req.user.username;
					createdComment.save();
					foundCamp.comments.push(createdComment);
					foundCamp.save();
					res.redirect("/camps/"+foundCamp._id);
				}else{
					console.log(err);
				}
		});

		}else{
			console.log(err);
		}
	});
});


router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){

	camp.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(!err){
					comment.findById(req.params.comment_id, function(err, foundComment){
						if (!err){
								 res.render("Comments/edit", {thisComment:foundComment, thisCamp: foundCamp});
						}else{

						}
					})
		}else{
				console.log(err);
		}
	});

});


router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){

	camp.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(!err){
					comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
						if (!err){
									foundCamp.save();
								 	res.redirect(/camps/+req.params.id);
						}else{
							console.log(err);
						}
					});
		}else{
				console.log(err);
		}
	});
});

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){

		camp.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
		if(!err){
					comment.findByIdAndRemove(req.params.comment_id, function(err, updatedComment){
						if (!err){
									foundCamp.save();
								 	res.redirect(/camps/+req.params.id);
						}else{
							console.log(err);
						}
					});
		}else{
				console.log(err);
		}
	});

})


module.exports = router;
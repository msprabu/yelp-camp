var middlewareObj ={};
var camp = require("../models/campground");
var comment = require("../models/comment");

middlewareObj.checkCommentOwnership = function(req, res, next){
	if (req.isAuthenticated()){
		camp.findById(req.params.id).populate("comments").exec(function(err, foundCamp){
				if (!err){
							comment.findById(req.params.comment_id, function(err, foundComment){
									if (!err){
												if(foundComment.author.id.equals(req.user._id)){
														next();
												}else{
													res.redirect("back");
												}
									}else{
												res.redirect("back");
									}
							});
				}else{
								res.redirect("back");
				}
		});

	}else{
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function (req, res, next){

	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

middlewareObj.checkCampOwnership = function (req, res, next){

if(req.isAuthenticated()){
	camp.findById(req.params.id, function(err, foundCamp){
			if(!err){
					if (foundCamp.creator.id.equals(req.user._id)){
							next();
					}else{
							res.redirect("back");
					}
			}else{
						res.redirect("back");

			}

	});

}else{
						res.redirect("back");

}

}

module.exports = middlewareObj;
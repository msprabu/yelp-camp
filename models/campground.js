var mongoose = require("mongoose");

var campSchema =  mongoose.Schema({		campName: String,
										imageUrl: String,
										comments: [{type: mongoose.Schema.Types.ObjectId,
										ref: "comment"}],
										creator: {id:{type: mongoose.Schema.Types.ObjectId, ref: "user"}, username: String}
								  });
module.exports = mongoose.model("camp",campSchema);
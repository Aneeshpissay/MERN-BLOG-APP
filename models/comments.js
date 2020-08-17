var mongoose = require("mongoose");
var commentSchema = new mongoose.Schema({
	message: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	}
},{
    timestamps: true
});

module.exports = mongoose.model("Comment", commentSchema);
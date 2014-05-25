// Model for the comment object
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	text: String,
	time: Date
});

var Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;
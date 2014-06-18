// Model for the "project" object
var mongoose = require('mongoose');
var CommentModel = require('./comment');
var Schema = mongoose.Schema;

// Set up and create schema -> model
var projectSchema = new mongoose.Schema({
	userID: Schema.Types.ObjectId,
	info: {
		title: String,
		tagline: String,
		genre: String,
		description: String,
		lore: String,
		gameplay: String,
		timestamp: {type: Date, default: Date.now}
	},
	views: {type: Number, default: 0},
	comments: Schema.Types.Mixed
});


projectSchema.methods.addComment = function(text) {
	var newComment = new CommentModel.Comment({
		text: text,
		time: new Date()
	});
	newComment.save();
	this.comments.push(newComment.text);
	this.save();
}

// Edit the specified field by giving it the specified text
projectSchema.methods.edit = function(field, text) {
	this[field] = text;
	this.save();
}

var Project = mongoose.model('Project', projectSchema);

exports.Project = Project;

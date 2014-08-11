// Model for the "project" object
var mongoose = require('mongoose');
var CommentModel = require('./comment');
var Schema = mongoose.Schema;

// Set up and create schema -> model
var projectSchema = new mongoose.Schema({

	_user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	info: {
		title: { type: String, default: "" },
		tagline: { type: String, default: ""},
		genre: {type: String, default: ""},
		description: {type: String, default: ""},
		lore: {type: String, default: ""},
		gameplay: String,
		timestamp: {type: Date, default: Date.now}
	},

	views: {type: Number, default: 0},

	_comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

// Validations
var required_message = 'Please enter a {PATH}';

projectSchema.path('_user').required(true, required_message); // Message should never be shown client side
projectSchema.path('info.title').required(true, required_message);
projectSchema.path('info.description').required(true, required_message);

projectSchema.path('views').validate(function(value) {
	return value >= 0;
}, 'Invalid number of views'); // Message should never be shown client side


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

// Model for the "project" object
var mongoose = require('mongoose');
var CommentModel = require('./comment');
var Schema = mongoose.Schema;

// Set up and create schema -> model
var projectSchema = new mongoose.Schema({
	title: String,
	genre: String,
	comments: [String]
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

var Project = mongoose.model('Project', projectSchema);

// Proof of concept dummy
var loadData = function() {
	var project = new Project({
		title: "Project1",
		genre: "adventure",
		comments: []
	});
	project.save(function(err, data) {
		if (err) console.log(err);
		else {
			console.log(data);
			Project.findById(data._id, function(err, project) {
				console.log("Found! " + project);
				project.addComment('YES');
				project.save();
				console.log("Edited: " + project);
			});
		}
	});
}

exports.Project = Project;
exports.loadData = loadData;
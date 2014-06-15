// Model for the "project" object
var mongoose = require('mongoose');
var CommentModel = require('./comment');
var Schema = mongoose.Schema;

// Set up and create schema -> model
var projectSchema = new mongoose.Schema({
	userID: Schema.Types.ObjectId,
	time: Date,
	title: String,
	tagline: String,
	genre: String,
	description: String,
	lore: String,
	gameplay: String,
	views: {type: Number, default: 0},
	comments: {Schema.Types.ObjectId}
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

/*
 * How to specify the nested pattern of comments? Maybe as a nest of JSON objects?
 *
 * Schema: Project
 * ---------------
 * Description: Projects are created by Users, and contain description information
 * about the project and the comments that were made on it. 
 *
 * Field: userID
 * -------------
 * userID: Required
 * 		Type: Object ID
 * 		Description: The User Object ID of the User that created the Project.
 * 		Default: N/A
 *
 * Field: info
 * Subfields: title, tagline, genre, description, lore, gameplay
 * -------------------------------------------------------------
 * info: Required
 * 		Type: Object
 *		Description: Contains information about the project, including important information
 *			about the User's ideas.
 *		Default: N/A
 * ** title: Required
 *		Type: String
 *		Description: The title of the project.
 * 		Default: N/A
 * ** tagline: Required
 *		Type: String
 *		Description: The tagline/description of the project.
 *		Default: N/A
 * ** genre: Required
 *		Type: String
 *		Description: Pick from a list of: (fill in!!!)
 *		Default: N/A
 * ** description: Required
 *		Type: String
 *		Description: The User's detailed description of the project.
 *		Default: N/A
 * ** lore: Required
 * 		Type: String
 *		Description: The lore of the project.
 *		Default: N/A
 * ** gameplay: Required
 *		Type: String
 *		Description: ??
 *		Default: N/A
 *
 *
 * Field: comments
 * ---------------
 * comments: Optional
 * 		Type: Mixed
 *		Description: Contains a nested structure of all of the Comment Object IDs corresponding
 * 			to Comments made on the Project.
 *		Default: {} (Empty Object)
 *
 */

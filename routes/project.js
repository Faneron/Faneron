/* FILE: routes/projects.js
 * ------------------------
 * Handlers for all routing related to project.
 */

var ProjectModel = require('../models/project');

// Implementation not complete -- see docs
exports.get = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findById(req.params.id, function(err, data) {
	if (err) {
		console.log("Error: " + err);
	} else {
		console.log(data);
		data.views++;
		data.save();
		res.send(data);
	}
	});
};

exports.create = function(req, res) {
	console.log(req.route.path);
	var project = new ProjectModel.Project({
		_user: req.user._id, // currently logged in user
		info: {
			title: req.body.title,
			tagline: req.body.tagline,
			genre: req.body.genre,
			description: req.body.description,
			lore: req.body.lore,
			gameplay: req.body.gameplay,
		}
	});
	project.save();
	res.send(200);
};

exports.update = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findById(req.params.id, function(err, doc) {
		if(err) console.log("Error: " + err);
		else {
			console.log(doc);
			for(var prop in doc) {
				if(req.body[prop] !== undefined) {
					doc[prop] = req.body[prop];
				}
			}
		}
	});
};

exports.delete = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findByIdAndRemove(req.params.id, function(err, doc) {
		if(err) console.log(err);
	});
};

exports.comments = function(req, res) {
	console.log(req.user);
	ProjectModel.Project
	.findById(req.params.id)
	.populate('comments') // NOT SURE IF THIS WORKS BECAUSE OF COMMENTS' NESTED STRUCTURE
	.exec(function(err, doc) {
		if(err) console.log(err);
		res.send(doc.comments);
	});
};

exports.user = function(req, res) {
	console.log(req.user);
	ProjectModel.Project
	.findById(req.params.id)
	.populate('_user')
	.exec(function(req, res) {
		if(err) console.log(err);
		res.send(doc._user);
	});
};
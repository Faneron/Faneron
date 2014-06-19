/* FILE: routes/projects.js
 * ------------------------
 * Handlers for all routing related to project.
 */

var ProjectModel = require('../models/project');

// Implementation not complete -- see docs
exports.projectGet = function(req, res) {
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

exports.projectCreate = function(req, res) {
	console.log(req.route.path);
	var project = new ProjectModel.Project({
		userID: req.user._id, // currently logged in user
		info: {
			title: req.body.title,
			tagline: req.body.tagline,
			genre: req.body.genre,
			description: req.body.description,
			lore: req.body.lore,
			gameplay: req.body.gameplay,
		}
		//comments: [];
	});
	project.save();
	res.send(200);
};

exports.projectUpdate = function(req, res) {
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

exports.projectDelete = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findByIdAndRemove(req.params.id, function(err, doc) {
		if(err) console.log(err);
	});
};
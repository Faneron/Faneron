/* FILE: routes/projects.js
 * ------------------------
 * Handlers for all routing related to project.
 */

var ProjectModel = require('../models/project');
var UserModel = require('../models/user');

exports.all = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.find()
		.populate('_user')
		.exec(function(err, data) {
			var options = {
				path: "comments._user",
				model: 'User'
			};
			if (err) console.log(err);
			else {
				console.log(data);
				ProjectModel.Project.populate(data, options, function(err, doc) {
					res.send(doc);
				});
			}
		});
}

// Implementation not complete -- see docs (FIXED!)
exports.get = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findById(req.params.id)
		.populate('_comments')
		.populate('_user')
		.exec(function(err, data) {
			console.log("Project info: ");
			console.log(data);
			var options = {
				path: "_comments._user",
				model: 'User'
			};
			if (err) console.log(err);
			else {
				data.views++;
				data.save();
				ProjectModel.Project.populate(data, options, function(err, doc) {
					console.log(doc);
					res.send(doc);
				});
				// res.send(data);
			}
		});
};

exports.create = function(req, res) {
	console.log(req.route.path);
	
	console.log(req.user);
	UserModel.User.findById(req.user._id, function(err, data) {
		if (err) console.log(err);
		else {
			console.log(data);
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
			data.projects.push(project._id);
			data.save();
			console.log(data);
		}
	});
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
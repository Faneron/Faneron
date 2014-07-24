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
		.populate('_user')
		// .populate('_user')
		.exec(function(err, data) {
			console.log("Project info: ");
			console.log(data);
			res.send(200, data);
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
	// only do one update at a time pls, and only for stuff under "info"
	console.log(req.route.path);
	var mainProp = null;
	ProjectModel.Project.findById(req.params.id, function(err, doc) {
		if(err) console.log("Error: " + err);
		else {
			console.log("\n\n\n UPDATING");
			for (var prop in req.body) {
				console.log(prop);
				doc.info[prop] = req.body[prop];
				mainProp = prop;
			}
			doc.save(function(err, data) {
				if (err) console.log(err);
				if (data) res.send(200, req.body[mainProp]);
			});
		}
	});
};

exports.delete = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findByIdAndRemove(req.params.id, function(err, doc) {
		if(err) console.log(err);
	});
};

// Recursive populate function for project comments
// project is the project object containing the comments (duh)
// pathString is the current path (tells how deep the recursive populate is)
// counter ticks down to count depth
function populateReplies(project, pathString, counter, res) {
	if (counter == 0) {
		res.send(200, project._comments);
		return;
	}
	counter--;
	console.log(counter);
	pathString += '._replies';
	project
		// first populate replies
		.populate({path: pathString, model: 'Comment'}, function(err, doc) {
			doc.populate({path: pathString + '._user', model: 'User'}, function(err, data) {
				populateReplies(data, pathString, counter, res);
			});
		});
}

// Gets only three levels of comments - get more by using comment model reply methods 
exports.comments = function(req, res) {
	ProjectModel.Project
	.findById(req.params.id)
	.populate('_comments') // NOT SURE IF THIS WORKS BECAUSE OF COMMENTS' NESTED STRUCTURE
	.exec(function(err, data) {
		data.populate({path: '_comments._user', model: 'User'}, function(err, doc) {
			if (err) console.log(err);
			populateReplies(doc, '_comments', 3, res);
		});
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
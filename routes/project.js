/* FILE: routes/projects.js
 * ------------------------
 * Handlers for all routing related to project.
 */

var ProjectModel = require('../models/project');
var UserModel = require('../models/user');

exports.all = function(req, res) {
	console.log(req.route.path);
	console.log(req.body);
	console.log(req.query);
	var params;
	if (!req.query.genre) params = {};
	else if (typeof req.query.genre === 'string') {
		params = {'info.genre' : req.query.genre};
	} else {
		params = {'info.genre': {$in: req.query.genre}};
	}
	ProjectModel.Project.find(params)
		.sort('-' + req.query.sort)
		.limit(10)
		.populate('_user')
		.exec(function(err, data) {
			var options = {
				path: "comments._user",
				model: 'User'
			};
			if (err) console.log(err);
			else {
				ProjectModel.Project.populate(data, options, function(err, doc) {
					res.send(doc);
				});
			}
		});
}

exports.get = function(req, res) {
	console.log(req.route.path);
	console.log(req.params);
	ProjectModel.Project.findById(req.params.id)
		.populate('_user')
		// .populate('_user')
		.exec(function(err, data) {
			console.log("Project info: ");
			console.log(data);
			data.views++;
			data.save();
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

// User that created the project
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

exports.upvote = function(req, res) {
	console.log("upvoting project " + req.params.id);
	ProjectModel.Project.findById(req.params.id, function(err, project) {
		if (err) console.log (err);
		else {
			UserModel.User.findById(project._user, function(err, user) {
				if (err) console.log(err);
				else {
					user.rank.xp++;
					user.save();
				}
			});

			// change project ranking etc...
			var upIndex = project.vote.upvoters.indexOf(req.user.id);
			if (upIndex !== -1) {
				console.log('already upboated this project');
				project.vote.upvoters.splice(upIndex, 1);
				project.vote.votes--;
				project.save();
				res.send(200, project);
				return;
			}

			var downIndex = project.vote.downvoters.indexOf(req.user.id);
			if (downIndex !== -1) {
				console.log('removing downboat');
				project.vote.downvoters.splice(downIndex, 1);
			}

			console.log('upboating!');
			project.vote.upvoters.push(req.user.id);
			project.vote.votes++;
			project.save();
			res.send(200, project);

		}
	});
}

exports.downvote = function(req, res) {
	console.log('downvoting project ' + req.params.id);
	ProjectModel.Project.findById(req.params.id, function(err, project) {
		if (err) console.log(err);
		else {
			UserModel.User.findById(project._user, function(err, user) {
				if (err) console.log(err);
				else {
					user.rank.xp--;
					user.save();
				}
			});

			// change project ranking etc...
			var downIndex = project.vote.downvoters.indexOf(req.user.id);
			if (upIndex !== -1) {
				console.log('already downboated this project');
				project.vote.downvoters.splice(downIndex, 1);
				project.vote.votes++;
				project.save();
				res.send(200, project);
				return;
			}

			var upIndex = project.vote.upvoters.indexOf(req.user.id);
			if (upIndex !== -1) {
				console.log('removing upboat');
				project.vote.upvoters.splice(upIndex, 1);
			}

			console.log('downboating!');
			project.vote.downvoters.push(req.user.id);
			project.vote.votes--;
			project.save();
			res.send(200, project);
		}
	});
}

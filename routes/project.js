/* FILE: routes/projects.js
 * ------------------------
 * Handles routing for all routing related to project.
 */

module.exports = function(app, isAuthorized) {

var ProjectModel = require('../models/project');
var UserModel = require('../models/user');

var isAuthorized = function (req, res, next) {
  if (req.user) {
    console.log(req.user);
    next();
  } else {
    console.log('Log in pls!');
    res.send(401);
  }
};

// Implementation not complete -- see docs
var projectGet = function(req, res) {
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

var projectCreate = function(req, res) {
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

var projectUpdate = function(req, res) {
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

var projectDelete = function(req, res) {
	console.log(req.route.path);
	ProjectModel.Project.findByIdAndRemove(req.params.id, function(err, doc) {
		if(err) console.log(err);
	});
};

	// Project routing is based on restricted-CRUD operations.
	// Certain data, such as the number of Project views,
	// cannot be changed by the user, and so are restricted.

	app.get('/project/get/:id', isAuthorized, projectGet);

	app.post('/project/create/', isAuthorized, projectCreate);

	app.post('/project/update/:id', isAuthorized, projectUpdate);

	app.post('/project/delete/:id', isAuthorized, projectDelete);
	
};


// ////////////////////////////////////////////////////

// 	// app.get('/projectData/:id', loggedIn, projects.projectData);
// 	// // Will be renamed: app.get('/project/get/:id', isAuthorized, getProject)
// 	// app.get('/allProjects/:username', loggedIn, projects.getUsersProjects);
// 	// app.get('/projects/all', loggedIn, projects.getAllProjects);
// 	// app.post('/projects', loggedIn, projects.createProject);

// var ProjectModel = require('../models/project');
// var UserModel = require('../models/user');

// // Get mongo entry for the requested project
// exports.projectData = function(req, res) {
// // renamed: var projectGet = function(req, res) {
// 	console.log("getting project: " + req.params.id);
// 	ProjectModel.Project.findById(req.params.id, function(err, data) {
// 		if (err) console.log("Error: " + err);
// 		else {
// 			console.log(data);
// 			data.views++;
// 			data.save();
// 			res.send(data);
// 		}
// 	});
// }

// // Get all projects for a given user (id'd by their username)
// exports.getUsersProjects = function(req, res) {
// 	console.log("getting project for user: " + req.params.username);
// 	UserModel.User.findOne({"username": req.params.username}, function(err, data) {
// 		if (err) console.log("Error: " + err);
// 		else {
// 			var user = data;
// 			console.log(user);
// 			ProjectModel.Project.find({userID: user._id}, function(err, data) {
// 				if (err) console.log("Error: " + err);
// 				else {
// 					res.send(data);
// 				}
// 			});
// 		}
// 	});
// }

// exports.createProject = function(req, res) {
// 	console.log(req.body);
// 	var project = new ProjectModel.Project({
// 		userID: req.user._id, // currently logged in user
// 		tim: new Date(),
// 		title: req.body.title,
// 		genre: req.body.genre,
// 		tagline: req.body.tagline,
// 		description: req.body.description,
// 		lore: req.body.lore,
// 		gameplay: req.body.gameplay,
// 		views: 0
// 	});
// 	project.save();
// 	res.send(200);
// }

// exports.getAllProjects = function(req, res) {
// 	ProjectModel.Project.find(function(err, data) {
// 		if (err) console.log("error with getting all projects");
// 		else {
// 			res.send(data);
// 		}
// 	});
// }
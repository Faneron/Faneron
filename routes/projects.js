var express = require('express');
var router = express.Router();
var ProjectModel = require('../models/project');
var UserModel = require('../models/user');

// Get mongo entry for the requested project
exports.projectData = function(req, res) {
	console.log("getting project: " + req.params.id);
	ProjectModel.Project.findById(req.params.id, function(err, data) {
		if (err) console.log("Error: " + err);
		else {
			console.log(data);
			data.views++;
			data.save();
			res.send(data);
		}
	});
}

// Get all projects for a given user (id'd by their username)
exports.getUsersProjects = function(req, res) {
	console.log("getting project for user: " + req.params.username);
	UserModel.User.findOne({"username": req.params.username}, function(err, data) {
		if (err) console.log("Error: " + err);
		else {
			var user = data;
			console.log(user);
			ProjectModel.Project.find({userID: user._id}, function(err, data) {
				if (err) console.log("Error: " + err);
				else {
					console.log(data);
					res.send(data);
				}
			});
		}
	});
}

exports.createProject = function(req, res) {
	console.log(req.body);
	var project = new ProjectModel.Project({
		userID: req.user._id, // currently logged in user
		title: req.body.title,
		genre: req.body.genre,
		tagline: req.body.tagline,
		description: req.body.description,
		lore: req.body.lore,
		gameplay: req.body.gameplay,
		views: 0
	});
	project.save();
	res.send(200);
}
var express = require('express');
var router = express.Router();
var ProjectModel = require('../models/project');

// Get mongo entry for the requested project
exports.projectData = function(req, res) {
	console.log("getting project: " + req.params.id);
	ProjectModel.Project.findById(req.params.id, function(err, data) {
		if (err) console.log("Error: " + err);
		else {
			console.log(data);
			res.send(data);
		}
	});
}
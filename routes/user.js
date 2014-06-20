/* FILE: routes/users.js
 * ---------------------
 */

var UserModel = require('../models/user');
var ProjectModel = require('../models/project');

// Routing associated with users
exports.get = function(req, res) {
	console.log(req.user);
	var dbSearchQuery;
	if(req.params.id !== undefined) {
		dbSearchQuery = {'_id' : req.params.id};
	} else {
		dbSearchQuery = {'username' : req.params.username};
	}
	UserModel.User.findOne(dbSearchQuery, 'projects', function(err, user) {
		if(err) console.log(err);
		else {
			console.log("User data retrieved!");
			res.send(user);
		}
	});
};

exports.projects = function(req, res) {
	console.log(req.user);
	// Outer callback - Returns a User with only the projects field
	UserModel.User
	.findById(req.params.id)
	.select('projects')
	.populate('projects')
	.exec(function(err, doc) {
		if(err) console.log(err);
		res.send(doc.projects);
	});
};

exports.comments = function(req, res) {
	console.log(req.user);
	UserModel.User
	.findById(req.params.id)
	.select('comments')
	.populate('comments')
	.exec(function(err, doc) {
		if(err) console.log(err);
		res.send(doc.comments);
	})
};

exports.update = function(req, res) {
	console.log(req.user);
	UserModel.User.findById(req.params.id, function(err, doc) {
		if(err) console.log(err);
		for(var field in doc) {
			if(doc.hasOwnProperty(field)) {
				doc[field] = req.params[field];
			}
		}
	})
};
/* FILE: routes/users.js
 * ---------------------
 */

var UserModel = require('../models/user');
var ProjectModel = require('../models/project');

// Routing associated with users
exports.get = function(req, res) {
	console.log(req.params.username);
	console.log("getting");
	var dbSearchQuery;
	if(req.params.id !== undefined) {
		dbSearchQuery = {'_id' : req.params.id};
	} else {
		dbSearchQuery = {'info.username' : req.params.username};
	}
	UserModel.User.findOne(dbSearchQuery, function(err, user) {
		if(err) console.log(err);
		else {
			console.log("User data retrieved!");
			console.log(user);
			res.send(user);
		}
	});
};

exports.projects = function(req, res) {
	console.log(req.params.username);
	// Outer callback - Returns a User with only the projects field
	UserModel.User
	.findOne({"info.username": req.params.username})
	.select('projects')
	.populate('projects')
	.exec(function(err, doc) {
		if(err) console.log(err);
		else res.send(doc.projects);
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
		// for(var field in doc) {
		// 	if(doc.hasOwnProperty(field)) {
		// 		doc[field] = req.params[field];
		// 	}
		// 	doc.save();
		// 	res.send(200, doc);
		// }
		console.log(req.body);
		for (var field in req.body) {
			doc[field] = req.body[field];
		}
		doc.save(function(err, data) {
			if (err) console.log(err);
			if (data) res.send(200, data);
		});
	})
};


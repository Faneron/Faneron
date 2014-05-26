var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

// Routing associated with users
exports.userData = function(req, res) {
	console.log(req.user);
	UserModel.User.findOne ({"username": req.params.username}, function(error, user) {
		if (error) console.log(error);
		else {
			console.log("User data retrieved!");
			res.send(user);
		}
	});
};

exports.userDataById = function(req, res) {
	UserModel.User.findById(req.params.id, function(error, user) {
		if (error) console.log(error);
		else {
			console.log("User data by id received");
			res.send(user);
		}
	});
}

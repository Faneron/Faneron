var express = require('express');
var router = express.Router();
var UserModel = require('../models/user')

// Routing associated with users
exports.userData = function(req, res) {
	console.log(req.user);
	var data = UserModel.User.findById(req.user._id, function(error, user) {
		if (error) console.log(error);
		else {
			console.log("User data retrieved!");
			res.send(user);
		}
	});
};

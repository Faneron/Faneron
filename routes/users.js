var express = require('express');
var router = express.Router();
var UserModel = require('../models/user')


/* GET users listing. */
// router.get('/', function(req, res) {
//   res.send('respond with a resource');
// });

exports.userData = function(req, res) {
	console.log(req.user);
	var data = UserModel.User.findById(req.user._id, function(error, user) {
		if (error) console.log(error);
		else {
			console.log(data);
			console.log("User data retrieved!");
			res.send(user);
		}
	});
};

// router.get('/api/userData', function(req, res) {
// 	var data = users.find(
// 		{},
// 		{firstName: 1}
// 	).limit(5);
// 	res.send(data);
// });

// module.exports = router;

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    UserModel = require('../models/user');

/* GET users listing. */
// router.get('/', function(req, res) {
//   res.send('respond with a resource');
// });

exports.userData = function(req, res) {
	var db = mongoose.connection;
	var data = db.users.find();
	// console.log('Yes!');
	res.send('hello world!');
};

// router.get('/api/userData', function(req, res) {
// 	var data = users.find(
// 		{},
// 		{firstName: 1}
// 	).limit(5);
// 	res.send(data);
// });

// module.exports = router;

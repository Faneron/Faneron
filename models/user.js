// Guess we're putting all our user-related shitz in here
// Sign up, log in, log out, edit user shitz
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passwordHash = require('password-hash');

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String
});

var User = mongoose.model('User', UserSchema);

<<<<<<< HEAD

// Unnecessary right now
// var load_data = function() {
// 	var user1 = new User({
// 		firstName: "Tod",
// 		lastName: "Jones",
// 		email: "minion@evil.com",
// 		password: "easypass"
// 	});
// 	user1.save(function(err) {
// 		if(err) {
// 			console.log(err);
// 		}
// 	});
// }


// Function for creating a user in da database 
var addUser = function(req, res) {
	var config = req.body;
	// Needs validation shitz
	// Pattern for errorz lel
	if (config.email === "qwer@qwer.com") {
		res.send(500, {error: "lol failz"});
	}
	var hash = passwordHash.generate(config.password);
	// Replace this with actual uzer infoz
	var user = new User({
		firstName: "Quack",
		lastName: "Moo",
		email: config.email,
		password: hash
=======
var load_data = function() {
	var user1 = new User({
		firstName: "Tod",
		lastName: "Jones",
		email: "minion@evil.com",
		username: "minion",
		password: "easypass"
>>>>>>> 54cde7a5dd0ed130167d8967e240193172bb1ef9
	});
	// Database save
	user.save(function(err, data) {
		if (err) {
			console.log(err);
		} else {
			console.log(data);
			res.send(200);
		}
	});
}

exports.User = User;
// exports.load_data = load_data;
exports.addUser = addUser;

/* FILE: user.js
 * -------------
 * Creates the User model and related methods for accessing the model.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passwordHash = require('password-hash');

/* Setup
 * The following section defines the User schema and model.
 */ 
var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String
});
var User = mongoose.model('User', UserSchema);

/* Function: addUser
 * -----------------
 * Adds a new user to the model based on information from the request.
 */
var addUser = function(req, res) {
	// var config = req.body;
	// // Needs validation shitz
	// // Pattern for errorz lel
	// if (config.email === "qwer@qwer.com") {
	// 	res.send(500, {error: "lol failz"});
	// }
	// var hash = passwordHash.generate(config.password);
	// // Replace this with actual uzer infoz
	// var user = new User({
	// 	firstName: "Quack",
	// 	lastName: "Moo",
	// 	email: config.email,
	// 	password: hash
	// });
	// user.save();
	// res.send(200);
}

/* Function: load_data
 * -------------------
 * Loads dummy data for testing.
 */
var loadData = function() {
	var user1 = new User({
		firstName: "Tod",
		lastName: "Jones",
		email: "minion@evil.com",
		username: "minion",
		password: "easypass"

	});
	// Database save
	user1.save(function(err, data) {
		if (err) {
			console.log(err);
		}
	});
}

exports.User = User;
exports.loadData = loadData;
exports.addUser = addUser;

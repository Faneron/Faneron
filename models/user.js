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
var userSchema = new mongoose.Schema({

	info: {
		firstName: String,
		lastName: String,
		username: String,
		email: String,
		password: String
	},

	rank: {
		currency: {type: Number, default: 0},
		xp: {type: Number, default: 0}
	},

	projects: [{
		type: Schema.Types.ObjectId,
		ref: 'Project'
	}],

	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

/* Function: generateHash
 * ----------------------
 * Generates a password hash given a password.
 */
userSchema.methods.generateHash = function(password) {
	return passwordHash.generate(password);
};

/* Function: validatePassword
 * --------------------------
 * Validates that the user's password is correct when logging in.
 */
 userSchema.methods.validatePassword = function(password) {
 	// Finish
 	return passwordHash.verify(password, this.password);
 };

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

exports.User = mongoose.model('User', userSchema);
exports.loadData = loadData;
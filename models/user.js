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
	firstName: String,
	lastName: String,
	username: String,
	email: String,
	password: String
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

/* Schema: User
 * ------------
 * Description: Each User represents a Faneron user. Each User has login
 * information that is filled in while signing up. Users also have currency
 * and experience (XP) which change based upon a user's behavior. Finally,
 * users have an array of Comments that they have posted and an array of
 * Projects they have made. 
 *
 * Field: info
 * Subfields: firstName, lastName, email, username, password
 * ---------------------------------------------------------
 * info: Required
 *		Type: Object
 *		Description: Contains login information about the user
 *		Default: N/A
 * 
 * ** firstName: Required
 *		Type: String
 *		Description: The User's real first name. Cannot be an empty string.
 *		Default: N/A
 *
 * ** lastName: Required
 *		Type: String
 *		Description: The User's real last name. Cannot be an empty string.
 *		Default: N/A
 *
 * ** email: Required
 *		Type: String
 *		Description: The User's email. Cannot be an empty string.
 *		Default: N/A
 *
 * ** username: Required
 *		Type: String
 *		Description: The User's chosen username. Cannot be an empty string.
 *		Default: N/A
 *
 * ** password: Required
 *		Type: String
 *		Description: The User's chosen password. Must be at least 8 characters.
 *		Default: N/A
 */

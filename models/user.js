/* FILE: user.js
 * -------------
 * Creates the User model and related methods for accessing the model.
 */
var mongoose = require('mongoose'),
	passwordHash = require('password-hash'),
	mongoose_unique_validator = require('mongoose-unique-validator'); // Used to report error messages at pre-save time
var Schema = mongoose.Schema;

var unique_message = "It seems like someone's already used that {PATH}";

var userSchema = new mongoose.Schema({

	info: {
		firstName: { type: String, default: '' },
		lastName: { type: String, default: '' },
		username: { type: String, unique: true },
		email: { type: String, unique: true },
		password: { type: String, },
	},

	bio: { type: String, default: '' },

	rank: {
		currency: {type: Number, default: 0},
		xp: {type: Number, default: 0}
	},

	profile: {type: String},

	art: [{type: String}],

	projects: [{
		type: Schema.Types.ObjectId,
		ref: 'Project'
	}],

	comments: [{
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}]
});

// Validations
// Note that validations for unique properties are in the schema itself
var required_message = 'Please enter a {PATH}';

userSchema.path('info.username').required(true, required_message);
userSchema.path('info.email').required(true, required_message);
userSchema.path('info.password').required(true, required_message);

var email_has_at = "Invalid email, there is no @ sign";
userSchema.path('info.email').validate(function(value) {
	if(!value) return false;
	return value.indexOf('@') !== -1;
}, email_has_at);
	
var password_too_short = 'Your password must be at least 6 characters long';
userSchema.path('info.password').validate(function(value) {
	if(!value) {
		return false;
	}
	return value.length >= 6;
}, password_too_short);

var password_not_username = "Your password can't be the same as your username";
userSchema.path('info.password').validate(function(value) {
	if(!value) return false;
	var username = this.info.username;
	return value !== username;
}, password_not_username);

userSchema.plugin(mongoose_unique_validator, unique_message);

// Schema methods

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
 	return passwordHash.verify(password, this.info.password);
 };

exports.User = mongoose.model('User', userSchema);

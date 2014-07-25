/* FILE: user.js
 * -------------
 * Creates the User model and related methods for accessing the model.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passwordHash = require('password-hash');

var userSchema = new mongoose.Schema({

	info: {
		firstName: { type: String, default: '' },
		lastName: { type: String, default: '' },
		username: { type: String, required: required_message },
		email: { type: String, required: required_message }, // TODO: Must have '@'
		password: { type: String, required: required_message },
	},

	bio: { type: String, default: '' },

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

// Validations
var required_message = 'Please enter a {PATH}';

userSchema.path('info.username').require(true, required_message);
userSchema.path('info.email').require(true, required_message);
userSchema.path('info.password').require(true, required_message);

userSchema.path('info.email').validate(function(value) {
	return value.indexOf('@') !== -1;
}, 'Invalid email');


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
 	console.log(this.info.password);
 	return passwordHash.verify(password, this.info.password);
 };

exports.User = mongoose.model('User', userSchema);

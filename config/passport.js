/* FILE: config/passport.js
 * ------------------------
 * Sets configuration for passport.js
 */

// load passport-related modules
LocalStrategy = require('passport-local').Strategy;

// load User-related modules
var UserModel = require('../models/user');

module.exports = function(passport) {
	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
	    done(null, user._id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
	    UserModel.User.findById(id, function(err, user) {
	        done(err, user);
	    });
	});

	passport.use('local-signup', new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
	    process.nextTick(function() {
	        UserModel.User.findOne({ "email": email }, function(err, user) {
	            if (err) return done(err);
	            // checks if user with that email already exists
	            if (user) {
	                return done(null, false, {message: 'email taken'});
	            } else {
	                var user = new UserModel.User;
	                user.email = email;
	                user.password = user.generateHash(password);
	                //user.password = passwordHash.generate(password);
	                user.save(function(err) {
	                    if (err) throw err;
	                    return done(null, user);
	                });
	            }
	        });
	    });
	}));
};
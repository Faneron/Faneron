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
	    // Doing this as an asynchronous thingy
	    process.nextTick(function() {
	    	console.log(req.body);
	        UserModel.User.findOne({ "email": email }, function(err, user) {
	            if (err) return done(err);
	            // checks if user with that email already exists
	            if (user) {
	                return done(null, false, req.flash('signupEmail', 'This email is already taken!'));
	            } else {
	            	if (req.body.confirm != req.body.password)
            			return done(null, false, req.flash('signupPassword', 'Passwords do not match!'));
            		else {
		                var user = new UserModel.User;
		                user.email = email;
		                user.password = user.generateHash(password);
		                //user.password = passwordHash.generate(password);
		                user.save(function(err) {
		                    if (err) throw err;
		                    return done(null, user); 
	                	});
                	}
	            }
	        });
	    });
	}));

	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		// Doing this as an async thing
		process.nextTick(function() {
			UserModel.User.findOne({ "email": email }, function(err, user) {
				if (err) 
					return done(err);
				if (!user) 
					return done(null, false, req.flash('loginEmail', 'Email was not found!'));
				if (!user.validatePassword(password))
					return done(null, false, req.flash('loginPassword', 'Password is invalid!'));
				// finish
				return done(null, user);
			});
		});
	}));

};
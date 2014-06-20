/* FILE: config/passport.js
 * ------------------------
 * Sets configuration for passport.js
 */

console.log("passport loading");

// load passport-related modules
var LocalStrategy = require('passport-local').Strategy;

// load User-related modules
var UserModel = require('../models/user');

module.exports = function(passport, flash, app) {
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(flash());

	console.log("configuring serialize/deserialize");
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

	// Local strategy for a user to sign up
	console.log("configuring local signup strategy");
	passport.use('local-signup', new LocalStrategy({
	    usernameField: 'email',
	    passwordField: 'password',
	    passReqToCallback : true // allows us to pass back the entire request to the callback
	},
	function(req, email, password, done) {
	    // Validates and creates User
	    process.nextTick(function() {
	    	console.log(req.body);
	        UserModel.User.findOne({ "info.email": email }, function(err, user) {
	            if (err) return done(err);
	            // checks if user with that email already exists
	            if (user)
	                return done(null, false, req.flash('signupEmail', 'This email is already taken!'));
	            // check if passwords are matching
	            if (req.body.confirm != req.body.password)
        			return done(null, false, req.flash('signupPassword', 'Passwords do not match!'));
	            else {
	            	UserModel.User.findOne({"info.username": req.body.username}, function(err, result) {
	            		console.log("results:");
	            		console.log(result);
	            		// Check if username is taken
	            		if (result) {
	            			return done(null, false, req.flash('signupUsername', 'This username is already taken!'));
	            		}
	            		else {
			                var user = new UserModel.User;
			                user.info.email = email;
			                user.info.password = user.generateHash(password);
			                user.info.username = req.body.username;
			                user.save(function(err) {
			                    if (err) throw err;
			                    return done(null, user); 
		                	});
	                	}
	            	});
	            }
	        });
	    });
	}));
	
	console.log("configuring local login strategy");
	// Local strategy for a user to login
	passport.use('local-login', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done) {
		// Doing this as an async thing
		process.nextTick(function() {
			UserModel.User.findOne({ "info.email": email }, function(err, user) {
				if (err) {
					console.log(err);
					return done(err);
				}
				// Checks if email is valid
				if (!user) {
					return done(null, false, req.flash('loginEmail', 'Email was not found!'));
				}
				// Checks if password is valid
				if (!user.validatePassword(password)) {
					return done(null, false, req.flash('loginPassword', 'Password is invalid!'));
				}
				return done(null, user);
			});
		});
	}));

};

console.log("passport loaded");
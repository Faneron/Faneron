/* FILE: auth.js
 * -------------
 * Manages routing for authorization and authentication.
 */

var passport = require('passport'),
    flash = require('connect-flash'),
    app = require('../app');
var AWS = require('aws-sdk');

// TODO: What is this being used for?
require('../config/passport');


exports.isLoggedIn = function(req, res, next) {
	if(req.user) {
		next();
	} else {
		console.log('Log in please');
		res.send(401);
	}
};


exports.login = function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
    	console.log("um so... error?");
	    if (err) {
			console.log("it worked...?");
	    	return next(err);
	    }
	    // Auth strategy returns no user if either email not found or password invalid
	    if (!user) {
	        // Weird bug thing -_-, have to declare var
	        console.log("no user found");
	        var message = req.flash(''); // get any flash messages sent by passport
	        console.log(message);
	        res.send(500, message);
	    }
	    // If it's legit, then yaysies! Let's log in!
	    else req.login(user, function(err) {
	        console.log("Logging in for rizzle");
	        next();
	    });
	})(req, res, next)
};


exports.loginRedirect = function(req, res) {
	console.log("what");
    console.log("Session: " + req.user);
    res.send(200, {redirect: 'profile', params: req.user.info.username});
};


exports.create = function(req, res, next) {
	console.log(passport);
	passport.authenticate('local-signup', function(err, user, info) {
        if (err) return next(err);
        // Auth strategy returns no user if the email is already taken
        if (!user) {
            res.send(500, req.flash(''));
        }
        // If it's legit, we do the login!
        else req.login(user, function(err) {
            console.log("Loggin in! :)");
            next();
        });
    })(req, res, next)
};


exports.isAuthenticated = function(req, res) {
	res.send(200, req.user);
}


// Route to log user out
exports.logout = function(req, res) {
    req.logout();
    res.send(200, {redirect: 'front'});
};

/*
Assumes that the server was run with the environment variables:
AWS_ACCESS_KEY 
AWS_SECRET_KEY
This information should come from the key-pairs provided by AWS.

*/
exports.sign_aws_s3 = function(req, res) {
    AWS.config.update({
        "accessKeyId": process.env.AWS_ACCESS_KEY,
        "secretAccessKey": process.env.AWS_SECRET_KEY
    });
	console.log(AWS.config);
    var s3 = new AWS.S3();
    var content_type = req.params; // TODO: Get content type somehow
    var params = {
        Bucket: "faneron-test",
        Key: "file-name", // TODO: Get unique file name
        ACL: 'authenticated-read',
        ContentType: '', // Get Mime Type of object
        Expires: 120,
    }
    s3.getSignedUrl('putObject', params, function(err, presigned_url) {
        if(err) {
			console.log(err);
            res.send(500);
			return;
        }
		console.log(presigned_url);
        res.send(presigned_url);
    });
    
}

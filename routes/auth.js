/* FILE: auth.js
 * -------------
 * Manages routing for authorization and authentication.
 */

var passport = require('passport'),
    flash = require('connect-flash'),
    app = require('../app');

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


// sign_aws_s3 should be used to sign an AWS S3 upload
// request from the server. This function helps prevent
// security breaches and abuse of using Faneron's S3
// account by creating a temporary signature that the
// client uses to upload information to S3
// Adapted from: https://devcenter.heroku.com/articles/s3-upload-node
exports.sign_aws_s3 = function(req, res) {

    var S3_BUCKET = process.env.S3_BUCKET,
        AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

    // Obtain POST request information:
    // file's name and mime type
    var object_name = req.query.s3_object_name,
        mime_type = req.query.s3_object_type;

    // Set expiration time
    var now = new Date(),
        expires = Math.ceil((now.getTime() + 10000) / 1000);

    // AWS request header
    // Allows the image to be publicly read
    var amz_headers = "x-amz-acl:public-read";

    // PUT request
    var put_req = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

    // Create the signature using SHA-1
    // The signature is created based on the AWS secret
    // key, and is sent to AWS to verify its validity
    // The signature is escaped for security reasons,
    // but the '+' sign is not escaped
    var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_req).digest('base64');
    signature = encodeURIComponents(signature.trim());
    signature = signature.replace('%2B','+');

    // The URL of the object
    var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

    var credentials = {
        signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
        url: url
    };
    res.write(JSON.stringify(credentials));
    res.end();
};
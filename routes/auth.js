/* FILE: auth.js
 * -------------
 * Manages routing for authorization and authentication.
 */

exports.isLoggedIn = function(req, res, next) {
	if(req.user) {
		console.log(req.user);
		next();
	} else {
		console.log('Log in please');
		res.send(401);
	}
};

exports.login = function(req, res, next) {
	passport.authenticate('local-login', function(err, user, info) {
	    if (err) return next(error);
	    // Auth strategy returns no user if either email not found or password invalid
	    if (!user) {
	        // Weird bug thing -_-, have to declare var
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
    console.log("Session: " + req.user);
    res.send(200, {redirect: 'profile', params: req.user.username});
};

exports.create = function(req, res, next) {
	passport.authenticate('local-signup', function(err, user, info) {
        if (err) return next(error);
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
	console.log('You are logged in');
	res.send(200, req.user);
}

// Route to log user out
exports.logout = function(req, res) {
    req.logout();
    res.send(200, {redirect: 'front'});
};
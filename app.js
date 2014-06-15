var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'),
    UserModel = require('./models/user');
var CommentModel = require('./models/comment');
var ProjectModel = require('./models/project');


var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var projects = require('./routes/projects');
var session = require('express-session')

var passwordHash = require('password-hash');
var flash = require('connect-flash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'anything' }));

// passport config
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./config/passport')(passport, flash); // pass passport for configuration;

// Setting up mongoose
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    // create schemas and models in here
});
mongoose.connect('mongodb://localhost/test');

function loggedIn(req, res, next) {
  if (req.user) {
    console.log(req.user);
    next();
  } else {
    console.log('Log in pls!');
    res.send(401);
  }
};

// Use this on front end to determine if the user is logged in
app.get('/login/current', loggedIn, function(req, res, next) {
    console.log('You are logged in');
    res.send(200, req.user);
});

// Set up route to auth using local-signup
app.post('/signup', function(req, res, next) {
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
    })(req, res, next)}, 
    function(req, res) {
        console.log("Session: " + req.user);
        res.send(200, {redirect: 'profile', params: req.user.username});
    }
);

// Set up route to auth using local-login
app.post('/login', function(req, res, next) {
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
    })(req, res, next)},
    function(req, res) {
        console.log("Session: " + req.user);
        res.send(200, {redirect: 'profile', params: req.user.username});
    });

// Route to log user out
app.get('/logout', function(req, res) {
    req.logout();
    res.send(200, {redirect: 'front'});
});

/* get user's data by username */
app.get('/userData/:username', loggedIn, users.userData);
// get user's data by id
app.get('/userId/:id', loggedIn, users.userDataById);

app.get('/projectData/:id', loggedIn, projects.projectData);
app.get('/allProjects/:username', loggedIn, projects.getUsersProjects);
app.get('/projects/all', loggedIn, projects.getAllProjects);
app.post('/projects', loggedIn, projects.createProject);

// app.get('/login', routes.login);
// Catch-all for base website layout
app.get('/partials/:name', routes.partials);
app.get('*', routes.index);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

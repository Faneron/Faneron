var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose'),
    UserModel = require('./models/user');

var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('express-session')

var passwordHash = require('password-hash');

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
require('./config/passport')(passport); // pass passport for configuration;

// Setting up mongoose
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', function callback() {
    // create schemas and models in here
    //UserModel.loadData();
});
mongoose.connect('mongodb://localhost/test');

function loggedIn(req, res, next) {
  if (req.user) {
    console.log(req.user);
  }
  next();
};

// Set up route to auth using local-signup
app.post('/users', passport.authenticate('local-signup', {session: true}), 
    function(req, res) {
        //console.log(req.user);
        res.send(200);
    }
);
/* Random dummy data */
app.get('/userData', loggedIn, users.userData);

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

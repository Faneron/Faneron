/* FILE: app.js
 * ------------
 * Launches the node.js web server.
 */

var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var multer = require('multer');

//var passwordHash = require('password-hash');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/Logo 1.jpg'));
app.use(logger('dev'));

app.get('/images/splash', function(req, res) {
	//supposed to be aliased as sendFile (but not -___-)
	var rand = Math.random()
	if (rand > 0.66) {
		var file = 'splash.jpg';
	} else if (rand > 0.33) {
		var file = 'splash2.jpg';
	} else {
		var file = 'splash3.jpg';
	}
	res.sendfile(__dirname + '/public/images/' + file);
});

app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: 'anything' }));
app.use(multer({dest: "./uploads"}));

// nconf
var nconf = require('nconf');
nconf.argv()
    .env()
    .file('./config/config_faneron_test.json')

// passport config
var passport = require('passport');
var flash = require('connect-flash');
require('./config/passport')(passport, flash, app); // pass passport for configuration;

// Mongoose
var mongoose = require('mongoose');
require('./config/mongoose')(mongoose);

// Routes
require('./routes/index.js')(app, passport);

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

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

//var passwordHash = require('password-hash');

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

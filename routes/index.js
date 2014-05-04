// Holds all node routes (to deal with angular routing and http requests)

var express = require('express');
var router = express.Router();

// Basic load page
exports.index = function(req, res){
    res.render('index', {title: 'Express'});

};

// Render all partials by name
exports.partials = function(req, res) {
    var name = req.params.name;
    console.log('Hurah!');
    res.render('partials/' + name);
};
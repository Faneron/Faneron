var Project = require('../models/project'),
    User = require('../models/user'),
    Comment = require('../models/comment');

exports.explore = function(req, res) {
    var body = req.body,
        featured = body.featured,
        stage = body.stage,
        development = body.development,
        genre = body.genre;

    
}
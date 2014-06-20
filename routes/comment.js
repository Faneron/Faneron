/* FILE: routes/comment.js
 * -----------------------
 * Description: Route handlers where the primary object is a Comment.
 */

var CommentModel = require('../models/comment'),
	UserModel = require('../models/user'),
	ProjectModel = require('../models/project');

exports.get = function(req, res) {
	console.log(req.user);
	CommentModel.Comment.findById(req.params.id, function(err, doc) {
		if(err) console.log(err);
		res.send(doc);
	})
};

exports.create = function(req, res) {
	console.log(req.user);
	var newComment = new CommentModel.Comment({
		_user: req.params.user._id,
		_project: req.body.project._id,
		text: {
			subject: req.body.subject,
			comment: req.body.comment,
			original: req.body.original
		}
	});
	newComment.save(function(err) {
		if(err) console.log(err);
	})
};

exports.update = function(req, res) {
	console.log(req.user);
	CommentModel.Comment.findById(req.params.id, function(err, doc) {
		for(var field in doc) {
			if(req.body.hasOwnProperty(field)) {
				doc = req.body.field;
			}
		}
		res.send(200, req.user);
	})
};

exports.delete = function(req, res) {
	console.log(req.user);
	CommentModel.Comment.findById(req.params.id, function(err, doc) {
		if(err) console.log(err);
		doc.deleted = true;
		res.send(200, req.user);
	});
};

exports.user = function(req, res) {
	console.log(req.user);
	CommentModel.Comment
	.findById(req.params.id)
	.populate('_user')
	.exec(function(err, doc) {
		if(err) console.log(err);
		res.send(doc._user);
	});
};

exports.project = function(req, res) {
	console.log(req.user);
	CommentModel.Comment
	.findById(req.params.id)
	.populate('_project')
	.exec(function(err, doc) {
		if(err) console.log(err);
		res.send(doc._project);
	});
};

exports.flag = function(req, res) {
	console.log(req.user);
	CommentModel.Comment.findById(req.params.id, function(err, doc) {
		if(err) console.log(err);
		doc.flag = true;
		res.send(200, req.user);
	});
};
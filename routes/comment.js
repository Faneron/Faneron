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
	res.send(200, req.user);
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

exports.upvote = function(req, res) {
	console.log(req.user);

	CommentModel.Comment.findById(req.params.id, 'vote', function(err, comment){
		if(err) console.log(err);
		UserModel.User.findById(req.user.id, 'rank', function(err, user){
			if(err) console.log(err);

			var vote = comment.vote;
			var rank = user.rank;

			// if the current user has already upvoted the comment, do nothing
			if(vote.upvoters.indexOf(req.user.id) !== -1) {
				res.send(204);
				return;
			}
			// if the current user has already downvoted the comment, reverse the effect of the downvote
			var downIndex = vote.downvoters.indexOf(req.user.id);
			if(downIndex !== -1) {
				// reverse comment votes
				vote.votes++;
				vote.downvoters.splice(downIndex, 1);
				// reverse user rank
				rank.xp++;
			}
			// upvote coment and increase user xp and currency each by 1
			vote.votes++;
			vote.upvoters.push(req.user.id);
			rank.xp++;
			rank.currency++;

			res.send(200, req.user);
		});
	});
};

// A downvote will decrement one unit of XP from the original poster, but will not affect the user’s currency. 
exports.downvote = function(req, res) {
	console.log(req.user);

	CommentModel.Comment.findById(req.params.id, 'vote', function(err, comment){
		if(err) console.log(err);
		UserModel.User.findById(req.user.id, 'rank', function(err, user){
			if(err) console.log(err);

			var vote = comment.vote;
			var rank = user.rank;

			// if the current user has already downvoted the comment, do nothing
			if(vote.downvoters.indexOf(req.user.id) !== -1) {
				res.send(204);
				return;
			}
			// if the current user has already upvoted the comment, reverse the effect of the upvote
			var upIndex = vote.upvoters.indexOf(req.user.id);
			if(upIndex !== -1) {
				// reverse comment votes
				vote.votes--;
				vote.upvoters.splice(upIndex, 1);
				// reverse user rank
				rank.xp--;
				rank.currency--;
			}
			// downvote comment and decrease user xp and currency each by 1
			vote.votes--;
			vote.downvoters.push(req.user.id);
			rank.xp--;
			rank.currency--;

			res.send(200, req.user);
		});
	});
};
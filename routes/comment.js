/* FILE: routes/comment.js
 * -----------------------
 * Description: Route handlers where the primary object is a Comment.
 */


console.log("configuring comment routes");

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
	console.log("creating comment");
	var newComment = new CommentModel.Comment({
		_user: req.user._id, // person who's posting it is the one logged in
		_project: req.body.project._id,
		text: {
			subject: req.body.subject,
			comment: req.body.comment,
			original: req.body.original
		}
	});
	newComment.save(function(err) {
		if(err) console.log(err);
	});
	ProjectModel.Project.findById(req.body.project._id, function(err, doc) {
		if (err) console.log(err);
		else {
			console.log(newComment._id);
			doc._comments.push(newComment._id);
			doc.save(function(err, doc) {
				if (err) console.log(err);
				else {
					res.send(200, newComment);
				}
			});
		}
	});
};

exports.reply = function(req, res) {
	console.log("replying to comment " + req.params.id);
	CommentModel.Comment.findById(req.params.id, function(err, comment) {
		if (err) console.log(err);
		else {
			console.log("found parent comment");
			var reply = new CommentModel.Comment({
				_user: req.user._id,
				_project: req.body.project._id,
				text: {
					subject: req.body.subject,
					comment: req.body.comment,
					original: req.body.original
				}
			});
			reply.save(function(err) {
				if (err) console.log(err);
			});
			comment._replies.push(reply._id);
			comment.save();
		}
	});
}

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
	console.log("blah");

	CommentModel.Comment.findById(req.params.id, function(err, comment){
		if(err) console.log(err);
		UserModel.User.findById(req.user.id, function(err, user){
			console.log("User finding");
			if(err) console.log(err);

			var vote = comment.vote;
			var rank = user.rank;


			// if the current user has already upvoted the comment, do nothing
			if(comment.vote.upvoters.indexOf(req.user.id) !== -1) {
				console.log("already upboated");
				res.send(204);
				return;
			}
			// if the current user has already downvoted the comment, reverse the effect of the downvote
			var downIndex = comment.vote.downvoters.indexOf(req.user.id);
			if(downIndex !== -1) {
				// reverse comment votes
				comment.vote.votes++;
				comment.vote.downvoters.splice(downIndex, 1);
				comment.save();
				// reverse user rank
				user.rank.xp++;
				user.save();
			}
			// upvote comment and increase user xp and currency each by 1
			comment.vote.votes++;
			comment.vote.upvoters.push(req.user.id);
			comment.save();
			user.rank.xp++;
			user.rank.currency++;
			user.save();

			console.log(user);
			console.log(comment);

			res.send(200, comment);
		});
	});
};

// A downvote will decrement one unit of XP from the original poster, but will not affect the user’s currency. 
exports.downvote = function(req, res) {
	console.log(req.user);

	CommentModel.Comment.findById(req.params.id, function(err, comment){
		if(err) console.log(err);
		UserModel.User.findById(req.user.id, function(err, user){
			if(err) console.log(err);

			// var vote = comment.vote;
			// var rank = user.rank;

			// if the current user has already downvoted the comment, do nothing
			if(comment.vote.downvoters.indexOf(req.user.id) !== -1) {
				res.send(204);
				return;
			}
			// if the current user has already upvoted the comment, reverse the effect of the upvote
			var upIndex = comment.vote.upvoters.indexOf(req.user.id);
			if(upIndex !== -1) {
				// reverse comment votes
				comment.vote.votes--;
				comment.vote.upvoters.splice(upIndex, 1);
				comment.save();
				// reverse user rank
				user.rank.xp--;
				user.rank.currency--;
				user.save();
			}
			// downvote comment and decrease user xp and currency each by 1
			comment.vote.votes--;
			comment.vote.downvoters.push(req.user.id);
			comment.save();
			user.rank.xp--;
			user.rank.currency--;
			user.save();
			res.send(200, comment);
		});
	});
};

console.log("done");
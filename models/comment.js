// Model for the comment object
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var commentSchema = new Schema({

	_user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},

	_project: {
		type: Schema.Types.ObjectId,
		ref: 'Project'
	},

	text: {
		subject: String,
		comment: String,
		original: Boolean,
	},

	vote: {
		votes: {type: Number, default: 0},
		upvoters: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}],
		downvoters: [{
			type: Schema.Types.ObjectId,
			ref: 'User'
		}]
	},

	_replies: {
		type: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}]
	},

	timestamp: {type: Date, default: Date.now},

	deleted: {type: Boolean, default: false},

	flag: {type: Boolean, default: false}

});

// Validations
var required_message = 'Please enter a {PATH}';

commentSchema.path('_user').require(true, required_message); // Message should never be shown client side
commentSchema.path('_project').require(true, required_message); // Message should never be shown client side
commentSchema.path('text.comment').require(true, required_message);
commentSchema.path('_user').require(true);
commentSchema.path('_project').require(true);

commentSchema.path('vote.votes').validate(function(value) {
	var vote = this.vote;
	return (value === (vote.upvoters.length - vote.downvoters.length));
}, 'Votes number isn\'t correct'); // Message should never be shown client side


var Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;
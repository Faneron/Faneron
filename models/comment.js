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

	_replies: [{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
	}],

	timestamp: {type: Date, default: Date.now},

	deleted: {type: Boolean, default: false},

	flag: {type: Boolean, default: false}

});

// Validations

var required_message = 'Please enter a {PATH}';
// An error message for these paths should never be shown client side
commentSchema.path('_user').required(true, required_message); 
commentSchema.path('_project').required(true, required_message);
commentSchema.path('text.original').required(true, required_message);
// Error messages here should be shown client side
commentSchema.path('text.comment').required(true, required_message);
commentSchema.path('_user').required(true);
commentSchema.path('_project').required(true);


var votes_message = "The number of votes is the number of upvotes - the number of downvotes";
commentSchema.path('vote.votes').validate(function(value) {
	var vote = this.vote;
	return (value === (vote.upvoters.length - vote.downvoters.length));
}, votes_message); // Message should never be shown client side


var original_message = "Original comments must have a subject."
commentSchema.path('text.subject').validate(function(value) {
	var original = this.text.original;
	return original ? Boolean(value) : true;
}, original_message);


var Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;

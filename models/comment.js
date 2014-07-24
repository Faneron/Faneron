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
		upvoters: [Schema.Types.ObjectId],
		downvoters: [Schema.Types.ObjectId]
	},

	_replies: {
		type: [{type: Schema.Types.ObjectId, ref: 'Comment'}]
	},

	timestamp: {type: Date, default: Date.now},

	deleted: {type: Boolean, default: false},

	flag: {type: Boolean, default: false}
});

var Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;


/*
 * Function: validate_text
 * -----------------------
 * Description: Among other things, should confirm that text.original and text.subject agree
 * 		logically.
 * Return value: Boolean
 *
 * Function: upvote
 * ----------------
 * Description: If the comment hasn't been downvoted by the user, then the comment's vote count is
 * 		incremented by 1. If the comment has been downvoted by the user, then the downvote is reversed
 * 		by incrementing the comment by 1 and removing the comment from the downvoters array, then 
 * 		incrementing the comment by 1. In both cases, the comment is added into the upvoters array.
 * Parameters: None
 * Return value: void
 *
 * Function: downvote
 * ------------------
 * Description: If the comment hasn't been upvoted by the user, then the comment's vote count is
 * 		decremented by 1. If the comment has been upvoted by the user, then the upvote is reversed
 * 		by decrementing the comment by 1 and removing the comment from the upvoters array, then 
 * 		decrementing the comment by 1. In both cases, the comment is added into the downvoters array.
 * Parameters: None
 * Return value: void
 *
 * Function: editSubject
 * ---------------------
 * Description: If the comment is an original comment, then the comment's subject line is changed to
 * 		the string passed into the function; true is return to indicate the change was successful.
 * 		If the comment is not an original comment, no changes are made, and false is returned.
 * Parameters:
 *		newSubj : String
 *			A String containing the new subject line.
 * Return value: Boolean
 *		Indicates whether the comment is an original comment.
 *
 * Function: editComment
 * ---------------------
 * Description: Sets the comment (text.comment) to a new message.
 * Return value: Void
 *
 * Function: setDeleted
 * --------------------
 * Description: Sets deleted to the value specified.
 * Return value: The previous value of deleted.
 *
 * Function: setFlag
 * -----------------
 * Description: Sets flag to the value specified.
 * Return value: The previous value of flag.
 *
 */

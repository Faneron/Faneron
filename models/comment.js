// Model for the comment object
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
	userID: Schema.Types.ObjectId, // User that posted this comment
	projectID: Schema.Types.ObjectId, // Project in which this comment was posted
	text: {
		subject: String, // Subject line of an original comment
		comment: String, // Text of the comment itself
		original: Boolean, // Indicates whether original comment or not
	},
	vote: {
		votes: Number,
		upvoters: [Schema.Types.ObjectId],
		downvoters: [Schema.Types.ObjectId]
	},
	timestamp: {type: Date, default: Date.now}, // Time the comment was posted; defaults to the time it was created
	deleted: {type: Boolean, default: false},  // Whether the user has deleted the post; default is false
	flag: {type: Boolean, default: false} // Marks the comment as spam -- maybe a number? -- will we have to know who marked it?
});





var Comment = mongoose.model('Comment', commentSchema);

exports.Comment = Comment;


/* Schema: Comment
 * ---------------
 * Description: Each comment represents a message that a user has
 * posted in a project. There are two types of comments: 1) Original
 * comments, and 2) regular comments. Original comments simply have
 * an additional subject line. Each comment belongs to a certain
 * user, and all comments that have been posted by a user can be 
 * displayed in one page. The comments can be filtered by time and
 * popularity (measured in terms of upvotes).
 *
 * Fields: userID, projectID
 * -------------------------
 * userID: Required
 *		Type: Schema.Types.ObjectId
 *		Description: The ID of the user that posted the comment.
 *		Default: N/A
 *
 * projectID: Required
 *		Type: Schema.Types.ObjectId
 * 		Description: The ID of the project on which the comment is posted.
 *		Default: N/A
 * 
 * Field: text
 * Sub-fields: subject, comment, original
 * --------------------------------------
 * text: Required
 *		Type: Object
 *		Description: Contains the comment text and, if applicable, the subject line.
 *			Also contains a boolean indicating whether the comment is an original
 *			comment, which determines how the comment should be displayed.
 *		Default: N/A
 *
 * ** subject: Optional
 *		Type: String
 * 		Description: The subject line text, if the comment is an original comment.
 *			If not, then subject should be undefined
 *		Default: N/A
 *
 * ** comment: Required
 *		Type: String
 * 		Description: The body/text of the comment. All comments must contain a string,
 *			even if it's an empty string.
 *		Default: ""
 *
 * ** original: Required
 *		Type: Boolean
 *		Description: Indicated whether the comment is an original comment. If it is,
 *			it should contain a subject line. True indicates that the comment is an
 *			original comment; false indicates that it isn't.
 *		Default: N/A
 *  
 * Field: Vote
 * Sub-fields: votes, upvoters, downvoters
 * ---------------------------------------
 * ** votes: Required
 * 		Type: Number
 *		Description: The vote count for a comment, which is the number of upvotes
 *			subtracted by the number of downvotes. Everytime a user up or down votes
 *			this comment, this field must be updated.
 *		Default: 0
 *
 * ** upvoters: Required
 *		Type: Array of User Object IDs
 *		Description: An array of all users that have upvoted this comment. This array
 * 			does not have to be ordered.
 *		Default: Empty array []
 *
 * ** downvoters: Required
 *		Type: Array of User Object IDs
 * 		Description: An array of all users that have downvoted this comment. This array
 *			does not have to be ordered.
 * 		Default: Empty array []
 *
 * Fields: timestamp, deleted, flag
 * --------------------------------
 * timestamp: Required
 *		Type: Date
 *		Description: The time at which the comment was created.
 *		Default: The time at which the comment was first created.
 *
 * deleted: Required
 *		Type: Boolean
 *		Description: Indicates whether the user has deleted the comment. Deleted comments are
 *			only marked as deleted, not actually removed from the database. False indicates
 *			that the comment has not been deleted; true indicates that is has.
 *		Default: False
 *
 * flag: Required
 *		Type: boolean 
 *		Description: Indicates whether the comment has been flagged as spam. True indicates that
 * 			the user has marked the comment as spam; false indicates that it hasn't.
 *		Default: False
 *
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
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
	}
	vote: {
		votes: Number,
		upvoters: [Schema.Types.ObjectId],
		downvoters: [Schema.Types.ObjectId]
	}
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
 * ** original: Required
 *		Type: Boolean
 *		Description: Indicated whether the comment is an original comment. If it is,
 *			it should contain a subject line.
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
 * ** upvoters: Required
 *		Type: Array of User Object IDs
 *		Description: An array of all users that have upvoted this comment. This array
 * 			does not have to be ordered.
 *		Default: Empty array []
 * ** downvoters: Required
 *		Type: Array of User Object IDs
 * 		Description: An array of all users that have downvoted this comment. This array
 *			does not have to be ordered.
 * 		Default: Empty array []
 *
 * Fields: timestamp, deleted, flag
 * --------------------------------
 * timestamp: Required
 *
 * deleted: Required
 *
 * flag: Required ?? How to encode?
 *
 *
 * Function: validate_text
 * -----------------------
 * Descr: Among other things, should confirm that text.original and text.subject agree
 * logically.
 * Return value: Boolean
 */
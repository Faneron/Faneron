// Model for the notification object
// Tells user when their project has been commented on
var mongoose = require ('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new mongoose.Schema({
	
	timeStamp: {type: Date, default: Date.now},

	// Who the notification will be sent to
	_user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	
	// Who did the commenting
	_fromUser: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	
	_project: {
		type: Schema.Types.ObjectId,
		ref: 'Project'
	},

	_comment: {
		type: Schema.Types.ObjectId,
		ref: 'Comment'
	}
});

var Note = mongoose.model('Note', noteSchema) ;

exports.Note = Note;

// Route handlers for notifications (Note)
var NoteModel = require('../models/note');

console.log("configuring notification routes");

exports.get = function(req, res) {
	var user = req.user._id;
	NoteModel.Note.find({"_user" : user})
		.limit(10)
		.sort("-timeStamp")
		.populate('_fromUser')
		.populate('_project')
		.populate('_comment')
		.exec(function(err, data) {
			if (err) {
				console.log(err);
				res.send(500);
			} else {
				if (!data) {
					res.send(404);
				} else {
					res.send(data);
				}
			}
		});
}

exports.all = function(req, res) {
	var user = req.user._id;
	NoteModel.Note.find({"_user" : user})
		.sort("-timeStamp")
		.populate('_fromUser')
		.populate('_project')
		.populate('_comment')
		.exec(function(err, data) {
			if (err) {
				console.log(err);
				res.send(500);
			} else {
				if (!data) {
					res.send(404);
				} else {
					res.send(data);
				}
			}
		});
}

exports.delete = function(req, res) {
	NoteModel.Note.findByIdAndRemove(req.params.id, function(err, data) {
		if (!data) res.send(404);
		else {
			console.log("success");
			res.send(200);
		}
	});
}

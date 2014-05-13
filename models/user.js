var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String
});

var User = mongoose.model('User', UserSchema);

var load_data = function() {
	var user1 = new User({
		firstName: "Tod",
		lastName: "Jones",
		email: "minion@evil.com",
		password: "easypass"
	});
	user1.save(function(err) {
		if(err) {
			console.log(err);
		}
	});
}

module.exports.User = User;
module.exports.load_data = load_data;
/* FILE: config/mongoose.js
 * ------------------------
 * Configures mongoose.
 */

module.exports = function(mongoose) {
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback() {
	    // create schemas and models in here
	});
	mongoose.connect('mongodb://localhost/test');
}
/* FILE: config/mongoose.js
 * ------------------------
 * Configures mongoose and sets up models.
 */

module.exports = function(mongoose) {
	var nconf = require('nconf');
	var config = nconf.get("DB");
	console.log(config);
console.log(nconf.get("AWS"));
	var connection = config.URL + ":" + config.PORT + "/" + config.NAME;
	mongoose.connect(connection);
}

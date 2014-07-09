/* FILE: config/mongoose.js
 * ------------------------
 * Configures mongoose and sets up models.
 */

module.exports = function(mongoose) {
	var DB_SERVER = 'test'; // server name

	var defaultDB = 'mongodb://localhost/test';

	var options = {
		user: 'quan',
		password: '12345'
	};

	var MONGOHQ_URL="mongodb://quan:12345@kahana.mongohq.com:10060/funzies";

	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error'));
	db.once('open', function callback() {
		// Declare schemas in here
	});
	// mongoose.connect('mongodb://localhost/' + DB_SERVER);
	mongoose.connect(MONGOHQ_URL);
	// mongoose.connect(onlineDB, options, function(err, data) {
	// 	if (err) console.log(err);
	// 	else {
	// 		console.log(data);
	// 		console.log("Connecting to mongoHQ");
	// 	}
	// });
}
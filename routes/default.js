/* FILE: default.js
 * ----------------
 * Description: Handlers for unhandled routes and general page rendering.
 */

exports.splash = function(req, res) {
	console.log("searchin' for a splash");
	if (Math.random() > 0.5) {
		res.sendFile('/images/_0000_Faneron.png');
	} else res.sendFile('/images/_0001_Message.png');
}

exports.partials = function(req, res) {
	console.log("Loaded partial");
	var name = req.params.name;
	console.log(name);
	res.render('partials/' + name);
}

exports.index = function(req, res) {
	res.render('index', {title: 'Faneron'});
};

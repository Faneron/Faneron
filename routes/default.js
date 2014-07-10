/* FILE: default.js
 * ----------------
 * Description: Handlers for unhandled routes and general page rendering.
 */

exports.partials = function(req, res) {
	console.log("Loaded partial");
	var name = req.params.name;
	console.log(name);
	res.render('partials/' + name);
}

exports.index = function(req, res) {
	res.render('index', {title: 'Faneron'});
};
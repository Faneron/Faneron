/* FILE: default.js
 * ----------------
 * Description: Handlers for unhandled routes and general page rendering.
 */

exports.partials = function(req, res) {
	res.render('index', {title: 'Express'});
}

exports.index = function(req, res) {
	var name = req.params.name;
	console.log("Loaded partial");
	res.render('partials/' + name);
};
/* FILE: routes/index.js
 * ---------------------
 * An index for other routes modules.
 */

module.exports = function(app, passport) {
	var projectHandlers = require('./project');
	var userHandlers = require('./users');
	var authHandlers = require('./auth');

	// Auth Routes
	app.post('/auth/login', authHandlers.authLogin, authHandlers.authLoginRedirect);

	app.get('/auth/create', authHandlers.authCreate, authHandlers.authLoginRedirect);

	app.get('/auth/isAuthenticated', authHandlers.isLoggedIn, authHandlers.authIsAuthenticated);

	app.get('/auth/logout', authHandlers.authLogout);

	// User Routes
	app.get('/user/get/:id', authHandlers.isLoggedIn, userHandlers.get);

	app.get('/user/projects/:id', authHandlers.isLoggedIn, userHandlers.projects);

	app.get('/user/comments/:id', authHandlers.isLoggedIn, userHandlers.comments);

	app.post('/user/update/:id', authHandlers.isLoggedIn, authHandlers.update);

	// Project Routes
	app.get('/project/get/:id', authHandlers.isLoggedIn, projectHandlers.projectGet);

	app.post('/project/create', authHandlers.isLoggedIn, projectHandlers.projectCreate);

	app.post('/project/update/:id', authHandlers.isLoggedIn, projectHandlers.projectUpdate);

	app.post('/project/delete/:id', authHandlers.isLoggedIn, projectHandlers.projectDelete);

	// Defaut routes
	app.get('/login', defaultHandlers.login);

	app.get('*', defaultHandlers.index);
};
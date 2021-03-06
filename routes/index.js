/* FILE: routes/index.js
 * ---------------------
 * An index for other routes modules.
 */
module.exports = function(app) {
	var projectHandlers = require('./project'),
		userHandlers = require('./user'),
		authHandlers = require('./auth'),
		commentHandlers = require('./comment'),
		defaultHandlers = require('./default'),
		exploreHandlers = require('./explore'),
		noteHandlers = require('./note'),
		s3Handlers = require('./s3');

	// Auth Routes
	app.post('/auth/login', authHandlers.login, authHandlers.loginRedirect);

	app.post('/auth/create', authHandlers.create, authHandlers.loginRedirect);

	app.get('/auth/isAuthenticated', authHandlers.isLoggedIn, authHandlers.isAuthenticated);

	app.get('/auth/logout', authHandlers.logout);

	// User Routes
	app.get('/user/get/:username', authHandlers.isLoggedIn, userHandlers.get);

	app.get('/user/projects/:username', authHandlers.isLoggedIn, userHandlers.projects);

	app.get('/user/comments/:id', authHandlers.isLoggedIn, userHandlers.comments);

	app.post('/user/update/:id', authHandlers.isLoggedIn, userHandlers.update);

	// Explore Routes
	app.post('/user/explore', authHandlers.isLoggedIn, exploreHandlers.explore);

	// Project Routes
	app.get('/project/get/all', authHandlers.isLoggedIn, projectHandlers.all);

	app.get('/project/get/:id', authHandlers.isLoggedIn, projectHandlers.get);

	app.post('/project/create', authHandlers.isLoggedIn, projectHandlers.create);

	app.post('/project/update/:id', authHandlers.isLoggedIn, projectHandlers.update);

	app.post('/project/delete/:id', authHandlers.isLoggedIn, projectHandlers.delete);

	app.get('/project/comments/:id', authHandlers.isLoggedIn, projectHandlers.comments);

	app.get('/project/user/:id', authHandlers.isLoggedIn, projectHandlers.user); // need to implement

	app.post('/project/upvote/:id', authHandlers.isLoggedIn, projectHandlers.upvote);

	app.post('/project/downvote/:id', authHandlers.isLoggedIn, projectHandlers.downvote);

	// Comment Routes
	app.get('/comment/get/:id', authHandlers.isLoggedIn, commentHandlers.get);

	app.get('/comment/thread/:id', authHandlers.isLoggedIn, commentHandlers.getThread);

	app.post('/comment/create', authHandlers.isLoggedIn, commentHandlers.create);

	app.post('/comment/reply/:id', authHandlers.isLoggedIn, commentHandlers.reply);

	app.post('/comment/update/:id', authHandlers.isLoggedIn, commentHandlers.update);

	app.post('/comment/delete/:id', authHandlers.isLoggedIn, commentHandlers.delete);

	app.get('/commment/user/:id', authHandlers.isLoggedIn, commentHandlers.user);

	app.get('/comment/project/:id', authHandlers.isLoggedIn, commentHandlers.project);

	app.post('/comment/project/:id', authHandlers.isLoggedIn, commentHandlers.flag);

	app.post('/comment/upvote/:id', authHandlers.isLoggedIn, commentHandlers.upvote);

	app.post('/comment/downvote/:id', authHandlers.isLoggedIn, commentHandlers.downvote);

	app.get('/notes', authHandlers.isLoggedIn, noteHandlers.get);

	app.get('/notes/all', authHandlers.isLoggedIn, noteHandlers.all);

	app.post('/notes/delete/:id', authHandlers.isLoggedIn, noteHandlers.delete);

	// S3 routes
	app.post('/s3/upload', s3Handlers.upload);

	app.post('/s3/cover/upload', s3Handlers.uploadCover);

	app.post('/s3/profile/upload', s3Handlers.uploadProfile);

	// Defaut routes
	app.get('/partials/:name', defaultHandlers.partials);

	app.get('*', defaultHandlers.index);
};

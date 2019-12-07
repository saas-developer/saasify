const authController = require('./controllers/authController');
const passport = require('passport');
const checkAuth = passport.authenticate('jwt', { session: false });

function addRoutes(app) {
	app.all('*', (req, res, next) => {
		console.log(req.method + ' ' + req.url);
		next();
	});

	app.get('/test-url', (req, res, next) => {
		res.send({
			success: true
		});
	})

	
	app.post('/api/register', authController.register);
	app.post('/api/login', authController.login);
	app.post('/api/account-activate', authController.accountActivate);
	app.post('/api/resend-activation-link', authController.resendActivationLink);
	app.post('/api/reset-password-link', authController.resetPasswordLink);
	app.post('/api/reset-password', authController.resetPassword);

	app.get('/api/test-auth', checkAuth , authController.testAuth);


}

const routes = {
	addRoutes
};

module.exports = routes;


const authController = require('./controllers/authController');
const paymentsController = require('./controllers/paymentsController');
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

	app.get('/api/logged-in-user', checkAuth, authController.getLoggedInUser);

	
	app.post('/api/register', authController.register);
	app.post('/api/login', authController.login);
	app.post('/api/account-activate', authController.accountActivate);
	app.post('/api/resend-activation-link', authController.resendActivationLink);
	app.post('/api/reset-password-link', authController.resetPasswordLink);
	app.post('/api/reset-password', authController.resetPassword);

	app.get('/api/test-auth', checkAuth , authController.testAuth);

	// Payments
	app.post('/api/payments/subscriptions', checkAuth, paymentsController.createSubscription );
    app.delete('/api/payments/subscriptions', checkAuth, paymentsController.deleteSubscription );
    app.get('/api/payments/subscriptions', checkAuth, paymentsController.getSubscription );
    app.get('/api/payments/cards', checkAuth, paymentsController.getCard );
    app.post('/api/payments/cards', checkAuth, paymentsController.updateCard );

}

const routes = {
	addRoutes
};

module.exports = routes;


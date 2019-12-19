const bodyParser = require('body-parser');
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

  app.post('/api/payments/session', checkAuth, paymentsController.createSession)

  app.post('/api/stripe/webhooks',
    bodyParser.raw({
      type: 'application/json'
    }),
    paymentsController.processStripeWebhook
  )
}

const routes = {
	addRoutes
};

module.exports = routes;


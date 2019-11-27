const authController = require('./controllers/authController');

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

}

const routes = {
	addRoutes
};

module.exports = routes;


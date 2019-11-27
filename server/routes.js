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
}

const routes = {
	addRoutes
};

module.exports = routes;


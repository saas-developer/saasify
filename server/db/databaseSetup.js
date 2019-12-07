// connect to DB

const mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
	.then(() => {
		console.log('SUCCESS: DB connection ');
	})
	.catch((err) => {
		console.log('ERROR: DB connection ');
		console.log('err ', err);
	});

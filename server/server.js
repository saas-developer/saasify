require('dotenv').config();
const express = require('express');
const compression = require('compression');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
// connect to database on startup
const databaseSetup = require('./db/databaseSetup');
const passport = require('./lib/passport');
const path = require('path');
const app = express();

app.use(compression());
app.use(bodyParser.json({
	limit: '5mb',

    verify: (req, res, buf) => {
        if (req.originalUrl === '/api/stripe/webhooks') {
            req.rawBody = buf;
        }
    }
}));
app.use(cookieParser());

routes.addRoutes(app);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
}

app.listen(process.env.APP_PORT || 3001, () => {
	console.log('Express Server started on PORT: ', process.env.APP_PORT || 3001);
});

process.on('uncaughtException', (error) => {
	console.log('uncaughtException');
	console.log('error ', error);
});

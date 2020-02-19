const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

const localOptions = {
	usernameField: 'email',
	passwordField: 'password'
};
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
	
	User.findOne({ email }, function (err, user) {
		if (err) {
			return done(err);
		}

		if (!user) {
            const errorObject = {
                error: true,
                errors: [{
                    code: 'GLOBAL_ERROR',
                    message: 'Your login details could not be verified. Please try again.'
                }]
            };

            // No user with that email address.. Cannot proceed
            done(null, null, errorObject);

			return;
		}
		
		
		// proceed with password validation
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}

			if (!isMatch) {
				const errorObject = {
                    error: true,
                    errors: [{
                        code: 'GLOBAL_ERROR',
                        message: 'Your login details could not be verified. Please try again.'
                    }]
                };

                done(null, null, errorObject);

				return;
			}

			done(null, user);
			return;

		})

		

	});
});


const jwtOpts = {}
// jwtOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

jwtOpts.jwtFromRequest = (req) => {
	const cookies = req.cookies;
	const token = cookies.token;

	if (token) {
		return token;
	}

	const headers = req.headers || {};
	const authHeader = headers.authorization || '';
	const headerToken = authHeader.split(' ')[1];
	if (headerToken) {
		return headerToken;
	}


	return null;
}

jwtOpts.secretOrKey = process.env.JWT_SECRET || 'TEMP_JWT_SECRET';

passport.use(new JwtStrategy(jwtOpts, function(jwtPayload, done) {
	const userId = jwtPayload._id;

    User.findOne({ _id: userId }, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false, {
            	code: 'GLOBAL_ERROR',
            	message: 'Email not associated with any account'
            });
        }
    });
}));


passport.use(localLogin);



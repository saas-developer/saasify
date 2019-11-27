const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
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
			// No user with that email address.. Cannot proceed
			done(null, null, {
				code: 'GLOBAL_ERROR',
				message: 'Your login details could not be verified. Please try again.'
			})

			return;
		}
		
		
		// proceed with password validation
		user.comparePassword(password, function(err, isMatch) {
			if (err) {
				return done(err);
			}

			if (!isMatch) {
				done(null, null, {
					code: 'GLOBAL_ERROR',
					message: 'Your login details could not be verified. Please try again.'
				})
				return;
			}

			done(null, user);
			return;

		})

		

	});
});


passport.use(localLogin);



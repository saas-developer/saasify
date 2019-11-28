const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
	console.log('req.body ', req.body);
	const {
		email,
		password
	} = req.body;

	// Validate the input fields
	const validationErrors = [];

	if (!email) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: 'email',
			message: ' You must provide an email address'
		});
	}

	const isEmailValid = email && validateEmail(email);
	if (email && !isEmailValid) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: 'email',
			message: 'Email is not valid'
		});
	}


	if (!password) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: 'password',
			message: ' You must provide a password'
		});
	}

	if (validationErrors.length) {
		const errorObject = {
			error: true,
			errors: validationErrors
		};

		res.status(422).send(errorObject);

		return;
	}

	// Save this info to DB

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			const errorObject = {
				error: true,
				errors: [{
					code: 'VALIDATION_ERROR',
					field: 'Email',
					message: 'Email already exists'
				}]
			};

			res.status(422).send(errorObject);

			return;
		}


		let user = new User({
			email,
			password
		});

		const savedUser = await user.save();

		console.log('savedUser ', savedUser);

		res.status(200).send({
			user: savedUser
		})

	} catch (e) {
		console.log('e ', e);
	}
	


}

exports.login = async (req, res, next) => {
	const {
		email,
		password
	} = req.body;
	// Validate the input fields
	const validationErrors = [];

	if (!email) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: 'email',
			message: ' You must provide an email address'
		});
	}

	const isEmailValid = email && validateEmail(email);
	if (email && !isEmailValid) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: 'email',
			message: 'Email is not valid'
		});
	}


	if (!password) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: 'password',
			message: ' You must provide a password'
		});
	}

	if (validationErrors.length) {
		const errorObject = {
			error: true,
			errors: validationErrors
		};

		res.status(422).send(errorObject);

		return;
	}

	passport.authenticate('local', (err, user, info) => {
		if (err) {
			return next(err);
		}

		if (!user) {
			res.status(401).send(info);
			return;			
		}

        if (!user.activated) {
            res.status(403).send({
                code: 'GLOBAL_ERROR',
                message: 'Account is not activated.'
            })
            return;
        }
		
		const userObject = user.toObject();
		const tokenObject = {
			_id: userObject._id
		}

		const jwtToken = jwt.sign(tokenObject, process.env.JWT_SECRET || 'TEMP_JWT_SECRET', {
			expiresIn: 86400 // seconds in a day
		})

		res.status(200).send({
			token: jwtToken,
			user: userObject
		});
		return;
		


	})(req, res, next);

}

exports.testAuth = async (req, res, next) => {
	console.log('req.user ', req.user);

	res.send({
		isLoggedIn: req.user ? true : false
	})
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const User = require('../models/User');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const {
  sendAccountActivationEmail,
  resendActivationLink,
  sendResetPasswordLinkEmail
} = require('../lib/EmailManager');

exports.register = async (req, res, next) => {
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
			password,
			activated: false,
			activationToken: uuidv1(),
			activationTokenSentAt: Date.now()
		});

		const savedUser = await user.save();

		console.log('savedUser ', savedUser);

		// Here -> We will send the email
		sendAccountActivationEmail(savedUser);

		res.status(200).send({
			user: User.toClientObject(savedUser)
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
		
		const userObject = user.toObject();
		const tokenObject = {
			_id: userObject._id
		}

		const jwtToken = jwt.sign(tokenObject, process.env.JWT_SECRET, {
			expiresIn: 86400 // seconds in a day
		})

		res.status(200).send({
			token: jwtToken,
			user: User.toClientObject(user)
		});
		return;
		


	})(req, res, next);

}

exports.accountActivate = async (req, res, next) => {
	const  {
		activationToken
	} = req.body;

	if (!activationToken) {
		const errorObject = {
			error: true,
			errors: [{
				code: 'VALIDATION_ERROR',
				message: 'Invalid Activation Token. Perhaps you requested a new token?'
			}]
		};

		res.status(422).send(errorObject);

		return;
	}

	try {
		const user = await User.findOne({
			activationToken
		});

		if (!user) {
			const errorObject = {
				error: true,
				errors: [{
					code: 'VALIDATION_ERROR',
					message: 'Invalid Activation Token. Perhaps you requested a new token?'
				}]
			};

			res.status(422).send(errorObject);

			return;
		}

		// We found a user
		user.activated = true;
		user.activationToken = undefined;
		user.activatedAt = Date.now();

		const savedUser = await user.save();
		
		return res.send({
			message: 'Your account has been activated. Please proceed to the Login page to Sign In'
		});


	} catch (e) {
		console.log('e ', e);
		res.status(500).send({
			error: true
		})
	}

}

exports.resendActivationLink = async (req, res, next) => {
	const {
		email
	} = req.body;

	if (!email) {
		const errorObject = {
			error: true,
			errors: [{
				code: 'VALIDATION_ERROR',
				message: 'Please specify the email account that needs activation'
			}]
		};

		res.status(422).send(errorObject);

		return;
	}

	try {
		const user = await User.findOne({
			email
		});

		if (user && !user.activated) {
			user.activationToken = uuidv1();
			user.activationTokenSentAt = Date.now();

			await user.save();

			// Send activation email
			//...
			await resendActivationLink(user);
		}


		return res.send({
			message: 'Activation Link has been sent'
		})

	} catch (e) {
		console.log('e ', e);
		res.status(500).send({
			error: true
		})
	}
}

exports.resetPasswordLink = async ( req, res, next) => {
	const {
		email
	} = req.body;

	if (!email) {
		const errorObject = {
			error: true,
			errors: [{
				code: 'VALIDATION_ERROR',
				message: 'Please specify the email account that needs password reset'
			}]
		};

		res.status(422).send(errorObject);

		return;
	}

	try {
		const user = await User.findOne({
			email
		});

		if (user) {
			user.resetPasswordToken = uuidv1();
			user.resetPasswordTokenSentAt = Date.now();

			const savedUser = user.save();

			// Send email now ...
			sendResetPasswordLinkEmail(user);

		}

		return res.send({
			message: 'Reset Password Link has been sent'
		})

	} catch (e) {
		console.log('e ', e);
		res.status(500).send({
			error: true
		})
	}

}

exports.resetPassword = async (req, res, next) => {
	const {
		resetPasswordToken,
		password
	} = req.body;

	const validationErrors = [];

	if (!password || !resetPasswordToken) {
		validationErrors.push({
			code: 'VALIDATION_ERROR',
			field: '',
			message: 'Sorry, we could not update your password'
		})
	}

	if (validationErrors.length) {
		return res.status(422).send(validationErrors);
	}

	try {
		const user = await User.findOne({
			resetPasswordToken
		});

		if (!user) {
			// Ignore ..
		}

		if (user) {
			user.password = password;
			user.resetPasswordToken = undefined;

			const savedUser = await user.save();
		}

		res.status(200).send({
			message: 'Your password has been successfully updated. Please go to the Login Page to Sign In again'
		});


	} catch (e) {
		console.log('e ', e);
		res.status(500).send({
			error: true
		})
	}
	


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

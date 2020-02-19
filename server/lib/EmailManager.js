const mailgun = require("mailgun-js");
const DOMAIN = process.env.MAILGUN_DOMAIN;
const APP_EMAIL = process.env.APP_EMAIL;

exports.sendAccountActivationEmail = async (user) => {

	const token = user.activationToken;
	// Eg: http://localhost:3000/account/activate?token=e04ce280-1ca8-11ea-b82f-dbd64ede476e
	const accountActivationLink = process.env.BASE_URL + '/account/activate?token=' + token;
	console.log('accountActivationLink', accountActivationLink);

	// Next, send this link via mailgun to the user
	const mg = mailgun({
		apiKey: process.env.MAILGUN_API_KEY,
		domain: DOMAIN
	});


	const data = {
		from: APP_EMAIL,
		to: process.env.NODE_ENV === 'production' ? user.email : APP_EMAIL,
		subject: 'Account Activation',
		template: "account_activation",
		'h:X-Mailgun-Variables': JSON.stringify({
			activation_link: accountActivationLink
		})
	};


	try {
		const body = await mg.messages().send(data);
		console.log('body', body);

	} catch (e) {
		console.log('e', e);
	}
}

exports.resendActivationLink = async (user) => {
	return exports.sendAccountActivationEmail(user);
}


exports.sendResetPasswordLinkEmail = async (user) => {

	const token = user.resetPasswordToken;
	// Eg: http://localhost:3000/account/reset-password?token=e04ce280-1ca8-11ea-b82f-dbd64ede476e
	const resetPasswordLink = process.env.BASE_URL + '/account/reset-password?token=' + token;
	console.log('resetPasswordLink', resetPasswordLink);

	// Next, send this link via mailgun to the user
	const mg = mailgun({
		apiKey: process.env.MAILGUN_API_KEY,
		domain: DOMAIN
	});


	const data = {
		from: APP_EMAIL,
		to: process.env.NODE_ENV === 'production' ? user.email : APP_EMAIL,
		subject: 'Reset Password',
		template: "reset_password_link",
		'h:X-Mailgun-Variables': JSON.stringify({
			reset_password_link: resetPasswordLink
		})
	};


	try {
		const body = await mg.messages().send(data);
		console.log('body', body);

	} catch (e) {
		console.log('e', e);
	}
}









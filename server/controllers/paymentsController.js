const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
	createCustomer,
	attachPaymentMethod,
	setPaymentMethodAsDefault,
	createSubscription,
	updateSubscription
} = require('../lib/stripeManager');

exports.createSubscription = async (req, res, next) => {
	const {
		paymentMethod,
		priceId
	} = req.body;

	const {
		email,
		id: userId,
		stripeDetails
	} = req.user;
	let subscription;
	let customer;
	let user = req.user;

	try {

		if (stripeDetails && stripeDetails.customer) {
			customer = stripeDetails.customer;
		} else {
			// Step 1 : Create a customer
			customer = await createCustomer(email);
			// Save the customer to database
			user = await User.saveStripeCustomer(userId, customer);
		}

		// Attach payment method to customer
	    await attachPaymentMethod(req.body.paymentMethod.id, customer);

	    // Make that payment method the default
		await setPaymentMethodAsDefault(req.body.paymentMethod.id, customer);

		if (stripeDetails && stripeDetails.subscription) {
			subscription = stripeDetails.subscription;

			const updatedSubscription = await updateSubscription(subscription, priceId);
			
			res.send({
				subscription: updatedSubscription
			});
			return;

		} else {
			// Step 2: Create a subscription
			subscription = await createSubscription(customer, priceId);
			
			await User.saveStripeSubscription(userId, subscription);

		    res.send({
		    	subscription
		    });
		    return;
		}

		
	} catch (e) {
		console.log(e);
		const validationErrors = [{
			code: 'GLOBAL_ERROR',
			field: '',
			message: 'Could not create a subscription'
		}];
		const errorObject = {
			error: true,
			errors: validationErrors
		};

		res.status(422).send(errorObject);
		return;
	}

}

exports.getSubscription = async (req, res, next) => {
	const user = req.user;

	const subscription = user.stripeDetails && user.stripeDetails.subscription;

	res.send({
		subscription
	})
}






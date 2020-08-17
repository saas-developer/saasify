const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
	createCustomer,
	attachPaymentMethod,
	setPaymentMethodAsDefault,
	createSubscription,
	updateSubscription,
	getPaymentMethod,
	cancelSubscription
} = require('../lib/stripeManager');
const _ = require('lodash');

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
	let paymentMethodId = _.get(paymentMethod, 'id');

	try {

		if (!paymentMethodId) {
			paymentMethodId = _.get(stripeDetails, 'customer.invoice_settings.default_payment_method');

			if (!paymentMethodId) {
				// This is an error
				res.status(422).send({
					message: 'No payment method available for this user'
				});
				return;
			}
		}

		if (stripeDetails && stripeDetails.customer) {
			customer = stripeDetails.customer;
		} else {
			// Step 1 : Create a customer
			customer = await createCustomer(email);

			// Attach payment method to customer
		    await attachPaymentMethod(paymentMethodId, customer);

		    // Make that payment method the default
			customer = await setPaymentMethodAsDefault(paymentMethodId, customer);

			// Save the customer to database
			user = await User.saveStripeCustomer(userId, customer);
		}

		

		if (stripeDetails && stripeDetails.subscription) {
			subscription = stripeDetails.subscription;

			const updatedSubscription = await updateSubscription(subscription, priceId);

			await User.saveStripeSubscription(userId, updatedSubscription);
			
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

exports.getCard = async (req, res, next) => {
	const user = req.user;

	const defaultPaymentMethodId = _.get(req.user, 'stripeDetails.customer.invoice_settings.default_payment_method');
	
	let paymentMethod;
	if (defaultPaymentMethodId) {
		paymentMethod = await getPaymentMethod(defaultPaymentMethodId);
	}

	res.send({
		card: _.get(paymentMethod, 'card', null)
	})
}

exports.updateCard = async (req, res, next) => {
	const {
		paymentMethod
	} = req.body;

	let user = req.user;
	let userId = user.id;
	let stripeDetails = user.stripeDetails;
	let customer = stripeDetails && stripeDetails.customer;

	if (!customer || !paymentMethod) {
		res.status(422).send({
			message: 'A payment method and a customer object is required'
		});
		return;
	}

	let paymentMethodId = _.get(paymentMethod, 'id');

	try {
		// Attach payment method to customer
	    await attachPaymentMethod(paymentMethodId, customer);

	    // Make that payment method the default
		customer = await setPaymentMethodAsDefault(paymentMethodId, customer);

		// Save the customer to database
		user = await User.saveStripeCustomer(userId, customer);

		res.send({
			customer
		})
	} catch (e) {
		res.status(500).send({
			code: 'GLOBAL_ERROR',
			field: '',
			message: 'An error occurred while updating your card'
		})
	}


}

exports.deleteSubscription = async (req, res, next) => {
	const user = req.user;
	const subscriptionId = _.get(user, 'stripeDetails.subscription.id');

	if (!subscriptionId) {
		res.status(422).send({
			message: 'You do not have any active subscription'
		});
		return;
	}

	let deletedSubsctiption;
	try {
		deletedSubsctiption = await cancelSubscription(subscriptionId);
		await User.saveStripeSubscription(user.id, null);
	} catch (e) {
		res.status(500).send({
			code: 'GLOBAL_ERROR',
			field: '',
			message: 'An error occurred while deleting your subscription'
		})
	}


	res.send({
		subscription: deletedSubsctiption
	})
}






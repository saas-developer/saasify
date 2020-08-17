const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCustomer = async (email) => {
	// Step 1 : Create a customer
	const customer = await stripe.customers.create({
	    email
	});

	return customer;
}

exports.attachPaymentMethod = async (paymentMethodId, customer) => {
	// Attach payment method to customer
	await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });
}

exports.setPaymentMethodAsDefault = async (paymentMethodId, customer) => {
    const newCustomer = await stripe.customers.update(
	    customer.id,
	    {
	      invoice_settings: {
	        default_payment_method: paymentMethodId,
	      },
	    }
	);

	return newCustomer;
}

exports.getPaymentMethod = async (paymentMethodId) => {
	const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
	return paymentMethod;
}

exports.createSubscription = async (customer, priceId) => {
	const subscription = await stripe.subscriptions.create({
	    customer: customer.id,
	    items: [{ price: priceId }],
	    expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
}

exports.updateSubscription = async (subscription, priceId) => {
	const updatedSubscription = await stripe.subscriptions.update(
	  subscription.id,
	  {
	  	items: [{
	  		id: subscription.items.data[0].id,
	  		price: priceId
	  	}],
	  }
	);
	return updatedSubscription;
}

exports.cancelSubscription = async (subscriptionId) => {
	const deletedSubscription = await stripe.subscriptions.del(subscriptionId);
	return deletedSubscription;
}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCustomer = async (paymentMethodId, email) => {
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email: email,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return customer;
}

exports.createSubscription = async (customerId, planId) => {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ plan: planId }],
      expand: ["latest_invoice.payment_intent"]
    });

    return subscription;
}

exports.updateSubscription = async (subscriptionId, newPlanId) => {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const updatedSubscription = stripe.subscriptions.update(subscriptionId, {
        items: [{
            id: subscription.items.data[0].id,
            plan: newPlanId
        }]
    });

    return updatedSubscription;
}

exports.retrievePaymentMethod = async (paymentMethodId) => {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    return paymentMethod;
}
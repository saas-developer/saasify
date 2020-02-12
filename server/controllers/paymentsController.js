const {
    createCustomer,
    createSubscription,
    updateSubscription,
    retrievePaymentMethod,
    deleteSubscription,
    attachPaymentMethodToCustomer,
    updateCustomer
} = require('../lib/StripeManager');
const User = require('../models/User');
const _ = require('lodash');
const stripe = require('stripe');

exports.createSubscription = async (req, res, next) => {
    const {
        planId = 'stripe-plan-basic',
        paymentMethod
    } = req.body;

    let user = req.user;


    const email = user.email;
    const userId = user.id;
    let paymentMethodId;

    if (!paymentMethod) {
        // Get paymentMethod from user object
        paymentMethodId = _.get(user, 'stripeDetails.customer.invoice_settings.default_payment_method');
    } else {
        paymentMethodId = paymentMethod.id;
    }

    if (!paymentMethodId) {
        res.status(422).send({
            message: 'No payment method available for user'
        });
        return;
    }

    // Step 1: Get stripe customer from database
    let stripeCustomer = user.stripeDetails && user.stripeDetails.customer;
    // If there is no stripe customer
    if (!stripeCustomer) {
        console.log('Creating Customer');
        // Then create a new record
        stripeCustomer = await createCustomer(paymentMethodId, email);
        // Save new customer to the database
        user = await User.saveStripeCustomer(userId, stripeCustomer);
    } else {
        console.log('Using Existing Customer');
    }


    // Step 1: Get stripe Subscription from database
    let stripeSubscription = user.stripeDetails && user.stripeDetails.subscription;
    // If there is no stripe Subscription
    if (!stripeSubscription) {
        console.log('Creating Subscription');
        stripeSubscription = await createSubscription(stripeCustomer.id, planId);
        user = await User.saveStripeSubscription(userId, stripeSubscription);
    } else {
        console.log('Using Existing Subscription');
        const subscriptionId = stripeSubscription.id;
        // Update subscription with new plan
        stripeSubscription = await updateSubscription(subscriptionId, planId);
        user = await User.saveStripeSubscription(userId, stripeSubscription);
    }


    

    console.log('Created Subscription');
    console.log(stripeSubscription);

    res.send({
        subscription: stripeSubscription
    })
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

    const stripeDetails = user.stripeDetails;
    const defaultPaymentMethod = _.get(stripeDetails, 'customer.invoice_settings.default_payment_method');

    if (defaultPaymentMethod) {
        const paymentMethod = await retrievePaymentMethod(defaultPaymentMethod);
        res.send({
            card: _.get(paymentMethod, 'card')
        });
        return;
    }

    res.send({
        card: null
    })
}

exports.updateCard = async (req, res, next) => {
    const {
        paymentMethod
    } = req.body;

    if (!paymentMethod) {
        res.status(422).send({
            message: 'Payment Method is required'
        });
        return;
    }

    let user = req.user;
    let paymentMethodId = paymentMethod.id;
    let customerId = _.get(user, 'stripeDetails.customer.id');
    let updatedPaymethod;
    let updatedCustomer;

    try {
        // Step 1: Attach payment method to customer
        updatedPaymethod = await attachPaymentMethodToCustomer(paymentMethodId, customerId);
        // Step 2: Update Customer and set payment method as default payment method
        updatedCustomer = await updateCustomer(customerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId
            }
        })
        // Step 3: Update our database with new customer information
        user = await User.saveStripeCustomer(user.id, updatedCustomer);

    } catch (e) {
        console.log('e', e);
        res.status(500).send({
            code: 'GLOBAL_ERROR',
            field: '',
            message: 'An occurred while updating your card'
        });
        return;
    }

    res.send({
        customer: updatedCustomer
    })

}

exports.deleteSubscription = async (req, res, next) => {
    let user = req.user;
    const subscriptionId = _.get(user, 'stripeDetails.subscription.id');

    if (!subscriptionId) {
        res.status(422).send({
            message: 'You do not have any active subscriptions'
        });
        return;
    }

    let deletedSubscription;

    try {
        deletedSubscription = await deleteSubscription(subscriptionId);
        user = await User.saveStripeSubscription(user.id, null);

        console.log('deletedSubscription', deletedSubscription);
    } catch (e) {
        res.status(500).send({
            code: 'GLOBAL_ERROR',
            field: '',
            message: 'An occurred while cancelling your subscription'
        });
        return;
    }

    res.send({
        subscription: deletedSubscription
    })

}

exports.processStripeWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
    }
    catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    switch (event.type) {
        case 'customer.subscription.updated': 
            console.log('Received customer.subscription.updated');
            console.log('event', event);
            const subscription = event.data.object;
            const customer = 'cus_GiK4wRu8IyTFoK'; // subscription.customer;

            let user = await User.findOne({
                'stripeDetails.customer.id': customer
            });

            if (user) {
                // Save subscription to the database
                console.log('user.toObject()', user.toObject());
                user = await User.saveStripeSubscription(user._id, subscription)
            }

            break;

    }
    
    // Return a response to acknowledge receipt of the event
    res.json({
        received: true
    });
}









const {
    createCustomer,
    createSubscription,
    updateSubscription,
    retrievePaymentMethod,
    deleteSubscription
} = require('../lib/StripeManager');
const User = require('../models/User');
const _ = require('lodash');

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









const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');

exports.createSession = async (req, res, next) => {
  const {
    planId
  } = req.body;

  try {
    let user = req.user;
    let customerId = (user.stripeDetails || {}).customerId;

    if (!customerId) {
      // Call Stripe to create a customer
      const newCustomer = await stripe.customers.create({
        email: user.email,
      });
      customerId = newCustomer.id;

      // save this info to DB
      user.stripeDetails = user.stripeDetails || {};
      user.stripeDetails.customerId = customerId;
      user.markModified('stripeDetails');

      user = await user.save();
    }

    // If user does not have a subscription
    //  THEN use checkout to create a new subscription
    //  ELSE upgrade/downgrade existing subscription

    const stripeDetails = user.stripeDetails || {};
    const userAlreadyHasSubscription = stripeDetails.plan && stripeDetails.subscriptionId;

    if (userAlreadyHasSubscription) {
      // User has a subscription plan
      // Upgrade/Downgrade existing one

      const subscription = await stripe.subscriptions.retrieve(stripeDetails.subscriptionId);
      const updatedSubscription = await stripe.subscriptions.update(stripeDetails.subscriptionId, {
        cancel_at_period_end: false,
        items: [{
          id: subscription.items.data[0].id,
          plan: planId,
        }]
      });

      const newPlan = updatedSubscription.items.data[0].plan;
      user.stripeDetails = user.stripeDetails || {};
      user.stripeDetails.plan = newPlan;

      user.markModified('stripeDetails');

      user = await user.save();

      console.log('updatedSubscription');
      console.log(JSON.stringify(updatedSubscription, 4, 4));

      res.status(200).send({
        success: true,
        sessionCreated: false
      })

    } else {
      // User does not have a subscription plan
      // Create a new one
      const session = await stripe.checkout.sessions.create({
          customer: customerId,
          payment_method_types: ['card'],
          subscription_data: {
            items: [{
              plan: planId,
            }],
          },
          success_url: process.env.BASE_URL + '/payments/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: process.env.BASE_URL + '/payments/cancel?session_id={CHECKOUT_SESSION_ID}',
        });

      // Session created. Now save the ID to the User model
      user.stripeCheckoutSessionId = session.id;
      await user.save();

      res.status(200).send({
        sessionCreated: true,
        session
      })
    }


    
  } catch(e) {
    console.log('e', e);
    res.status(500).send({
      error: true
    })
  }
}

exports.processStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Fulfill the purchase...
      // Update the database with subscription details
      handleCheckoutSessionCompleted(session);
    }


    res.json({received: true});
}

const handleCheckoutSessionCompleted = async (session) => {
  const checkoutSessionId = session.id;

  try {
    const user = await User.findOne({
      stripeCheckoutSessionId: checkoutSessionId
    });

    if (!user) {
      console.log('User object not found for checkoutSessionId ', checkoutSessionId);
      return;
    }

    const plan = session.display_items[0].plan;
    const subscriptionId = session.subscription;

    user.stripeDetails = user.stripeDetails || {};
    user.stripeDetails.plan = plan;
    user.stripeDetails.subscriptionId = subscriptionId;

    user.markModified('stripeDetails');

    await user.save();

  } catch (error) {
    console.log('Error in handleCheckoutSessionCompleted ', checkoutSessionId);
    console.log('error', error);
  }
}





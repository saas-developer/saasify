const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSession = async (req, res, next) => {
  const {
    planId
  } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        subscription_data: {
          items: [{
            plan: planId,
          }],
        },
        success_url: process.env.BASE_URL + '/payments/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.BASE_URL + '/payments/cancel?session_id={CHECKOUT_SESSION_ID}',
      });

    res.status(200).send({
      session
    })
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
      console.log('event');
      console.log(JSON.stringify(event, 4, 4));
      const session = event.data.object;
      console.log('session');
      console.log(JSON.stringify(session, 4, 4));

      // Fulfill the purchase...
      // Update the database with subscription details
    }


    res.json({received: true});
}


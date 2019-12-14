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

    res.status(200),send({
      session
    })
  } catch(e) {
    console.log('e', e);
    res.status(500).send({
      error: true
    })
  }
}

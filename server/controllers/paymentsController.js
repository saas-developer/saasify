
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createSubscription = async (req, res, next) => {
	const {
		paymentMethod,
		priceId
	} = req.body;

	const email = req.user.email;
	let subscription;

	try {
		// Step 1 : Create a customer
		const customer = await stripe.customers.create({
		    email
		});

		// Attach payment method to customer
		await stripe.paymentMethods.attach(req.body.paymentMethod.id, {
	      customer: customer.id,
	    });

	    // Make that payment method the default
	    await stripe.customers.update(
		    customer.id,
		    {
		      invoice_settings: {
		        default_payment_method: req.body.paymentMethod.id,
		      },
		    }
		);

		// Step 2: Create a subscription
		subscription = await stripe.subscriptions.create({
		    customer: customer.id,
		    items: [{ price: priceId }],
		    expand: ['latest_invoice.payment_intent'],
	    });
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

	
    res.send({
    	subscription
    });
}








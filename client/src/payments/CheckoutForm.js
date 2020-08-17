import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';

export default function CheckoutForm(props) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
      // We don't want to let default form submission happen here,
      // which would refresh the page.
      event.preventDefault();

      if (!stripe || !elements) {
        // Stripe.js has not yet loaded.
        // Make sure to disable form submission until Stripe.js has loaded.
        return;
      }
      // Get a reference to a mounted CardElement. Elements knows how
      // to find your CardElement because there can only ever be one of
      // each type of element.
      const cardElement = elements.getElement(CardElement);

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        console.log('[createPaymentMethod error]', error);
      } else {
        console.log('[PaymentMethod]', paymentMethod);
        const paymentMethodId = paymentMethod.id;
        console.log('[paymentMethodId]', paymentMethodId);
        // if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
        //   // Update the payment method and retry invoice payment
        //   const invoiceId = localStorage.getItem('latestInvoiceId');
        //   retryInvoiceWithNewPaymentMethod({
        //     customerId,
        //     paymentMethodId,
        //     invoiceId,
        //     priceId,
        //   });
        // } else {
        //   // Create the subscription
        //   createSubscription({ customerId, paymentMethodId, priceId });
        // }
        props.onPaymentMethodCreated(paymentMethod);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
  );
}

import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import CardSection from './CardSection';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <form onSubmit={handleSubmit}>
      <CardSection />
      <button disabled={!stripe}>Confirm order</button>
    </form>
  );
}

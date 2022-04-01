import React from 'react';
import { StripeProvider, Elements } from 'react-stripe-elements';
import CreditCardForm from './CreditCardForm';

export default class StripeProviderComponent extends React.Component {
  render() {
    return (
      <div>
        <StripeProvider apiKey="pk_test_cPAYuvk1DKJ0cqm0cm0Zblms" >
          <Elements>
            <CreditCardForm
                user={this.props.user}
                onPaymentMethodCreated={this.props.onPaymentMethodCreated}
                actionButtonText={this.props.actionButtonText}
            />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}

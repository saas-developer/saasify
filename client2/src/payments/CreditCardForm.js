/**
* Use the CSS tab above to style your Element's container.
*/
import React from 'react';
import { CardElement, injectStripe } from 'react-stripe-elements';
import Button from 'react-bootstrap/Button';

const style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },
  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

class CardSection extends React.Component {
  handleSubmitClick = async (event) => {

    const cardElement = this.props.elements.getElement('card');

    const { paymentMethod, error } = await this.props.stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        email: this.props.user.email,
      },
    });

    console.log('paymentMethod', paymentMethod);
    console.log('error', error);

    if (!error) {
        this.props.onPaymentMethodCreated(paymentMethod);
    }
  }

  render() {
    return (
      <div>
        <form>
          <div style={{ padding: 24 }}>
            Card details
            <CardElement className="MyCardElement" style={style} />
          </div>

          <Button
            variant="primary"
            type="button"
            onClick={this.handleSubmitClick}
          >
            {this.props.actionButtonText}
          </Button>
        </form>
      </div>
    );
  }
};

export default injectStripe(CardSection);

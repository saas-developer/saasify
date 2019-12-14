import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const stripe = window.Stripe('pk_test_cPAYuvk1DKJ0cqm0cm0Zblms');

export default class CreateSubscription extends React.Component {
  state = {
    selectedPlan: ''
  }

  handlePlanChange = (event) => {
    this.setState({
      selectedPlan: event.target.value 
    });

  }

  handleSubmitClick = () => {
    // Create Checkout Session
    const url = '/api/payments/session';
    
    fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify({
        planId: this.state.selectedPlan
      })
    }).then((response) => {
      if (!response.ok) {
        return response.json().then(err => { throw err })
      }
      return response.json();
    }).then((results) => {
      console.log('results ', results);
      const checkoutSessionId = results.session.id;

      stripe.redirectToCheckout({
        // Make the id field from the Checkout Session creation API response
        // available to this file, so you can provide it as parameter here
        // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
        sessionId: checkoutSessionId
      }).then(function (result) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        console.log('result.error.message', result.error.message);
      });
      
    }).catch((error) => {
      console.log('error ', error);
    })
  }

  render() {
    return (
      <div>
        <Form>
          <Form.Group controlId="selectPlan">
            <Form.Label>Select Plan</Form.Label>
            <Form.Control
              as="select"
              value={this.state.selectedPlan}
              onChange={this.handlePlanChange}
            >
              <option value="">Select a Plan</option>
              <option value="stripe-plan-basic">Basic</option>
              <option value="stripe-plan-enterprise">Enterprise</option>
              <option value="stripe-plan-startup">Startup</option>
            </Form.Control>
          </Form.Group>
          <Button
            variant="info"
            onClick={this.handleSubmitClick}
            disabled={this.state.selectedPlan === ''}
          >Subscribe</Button>
        </Form>
      </div>
    );
  }
}

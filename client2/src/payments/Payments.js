import React from 'react';
import CurrentSubscription from './CurrentSubscription';
import CurrentCard from './CurrentCard';
import CreateSubscription from './CreateSubscription';
import UpdateCard from './UpdateCard';
import _get from 'lodash/get';

const stripe = Stripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY); // eslint-disable-line

export default class Payments extends React.Component {
	state = {
		subscription: null,
		card: null,
        plan: ''
	}
	componentDidMount() {
		this.getPaymentDetails();
	}

	getPaymentDetails = () => {
		this.getSubscription();
		this.getCard();
	}

    setPlan = (planId) => {
        this.setState({
            plan: planId
        })
    }

	createSubscription = (paymentMethod) => {
        if (!this.state.plan) {
            // Show error to user
            return;
        }

        const planId = this.state.plan;

		const url = '/api/payments/subscriptions';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: JSON.stringify({
				planId: planId,
				paymentMethod
			})
		}).then((response) => {
			if (!response.ok) {
				return response.json().then(err => { throw err })
			}
			return response.json();
		}).then((results) => {
			console.log('results ', results);
            const subscription = _get(results, 'subscription');
            const paymentIntentStatus = _get(subscription, 'latest_invoice.payment_intent.status', '');
            const client_secret = _get(subscription, 'latest_invoice.payment_intent.client_secret', '');
            if (paymentIntentStatus === 'requires_action' || paymentIntentStatus ===  'requires_payment_method') {
                stripe.confirmCardPayment(client_secret).then(function(result) {
                    console.log('confirmCardPayment result', result);
                    if (result.error) {
                        // Display error message in your UI.
                        // The card was declined (i.e. insufficient funds, card has expired, etc)
                        alert(result.error);

                    } else {
                        // Show a success message to your customer
                        alert('You have successfully confirmed the payment');
                        window.location.href = '/payments';
                    }


                });
            }

            // this.getPaymentDetails();
			
		}).catch((error) => {
			console.log('error ', error);
            // this.getPaymentDetails();
            window.location.href = '/payments';
		})
	}

    updateCard = (paymentMethod) => {
        const url = '/api/payments/cards';
        
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({
                paymentMethod
            })
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw err })
            }
            return response.json();
        }).then((results) => {
            console.log('results ', results);
            // this.getPaymentDetails();
            window.location.href = '/payments';
            
        }).catch((error) => {
            console.log('error ', error);
            // this.getPaymentDetails();
            window.location.href = '/payments';
        })
    }

    deleteSubscription = () => {
        const url = '/api/payments/subscriptions';
        
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'DELETE'
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw err })
            }
            return response.json();
        }).then((results) => {
            console.log('results ', results);
            // this.getPaymentDetails();
            window.location.href = '/payments';
            
        }).catch((error) => {
            console.log('error ', error);
            // this.getPaymentDetails();
            window.location.href = '/payments';
        })
    }

	getSubscription = (paymentMethod) => {
		const url = '/api/payments/subscriptions';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'GET'
		}).then((response) => {
			if (!response.ok) {
				return response.json().then(err => { throw err })
			}
			return response.json();
		}).then((results) => {
			console.log('results ', results);
			this.setState({
				subscription: results.subscription
			})
			
		}).catch((error) => {
			console.log('error ', error);
		})
	}

	getCard = () => {
		const url = '/api/payments/cards';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'GET'
		}).then((response) => {
			if (!response.ok) {
				return response.json().then(err => { throw err })
			}
			return response.json();
		}).then((results) => {
			console.log('results ', results);
			this.setState({
				card: results.card
			})
			
		}).catch((error) => {
			console.log('error ', error);
		})
	}

	render() {
        const customer = _get(this.props.user, 'stripeDetails.customer');

		return (
		  <div className="container">
			<div>
			  <h2>Payments</h2>

              <div className="row">
                <div className="col-12 col-sm-6 mb-4 d-flex align-items-stretch">
                      <CurrentSubscription
                        subscription={this.state.subscription}
                        deleteSubscription={this.deleteSubscription}
                      />
                </div>
                <div className="col-12 col-sm-6 mb-4 d-flex align-items-stretch">
                    <CurrentCard card={this.state.card}/>
                </div>
              </div>

			  
			  
              {
                customer &&
                <UpdateCard
                  user={this.props.user}
                  card={this.state.card}
                  onPaymentMethodCreated={this.updateCard}
                />
              }

			  <CreateSubscription
                  user={this.props.user}
                  card={this.state.card}
                  plan={this.state.plan}
                  setPlan={this.setPlan}
                  onPaymentMethodCreated={this.createSubscription}
                  actionButtonText={"Subscribe"}
              />
			</div>
		  </div>
		);
	}
}

import React from 'react';
import CurrentSubscription from './CurrentSubscription';
import CurrentCard from './CurrentCard';
import StripeProviderComponent from './StripeProviderComponent';
import CreateSubscription from './CreateSubscription';
import UpdateCard from './UpdateCard';

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
            this.getPaymentDetails();
			
		}).catch((error) => {
			console.log('error ', error);
            this.getPaymentDetails();
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
            this.getPaymentDetails();
            
        }).catch((error) => {
            console.log('error ', error);
            this.getPaymentDetails();
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
            this.getPaymentDetails();
            
        }).catch((error) => {
            console.log('error ', error);
            this.getPaymentDetails();
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
		return (
		  <div className="container">
			<div>
			  <h2>Payments</h2>

			  <CurrentSubscription
                subscription={this.state.subscription}
                deleteSubscription={this.deleteSubscription}
              />
			  <CurrentCard card={this.state.card}/>
              <UpdateCard
                user={this.props.user}
                card={this.state.card}
                onPaymentMethodCreated={this.updateCard}
              />

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

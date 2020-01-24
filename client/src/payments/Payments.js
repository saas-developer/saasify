import React from 'react';
import StripeProviderComponent from './StripeProviderComponent';
import CurrentSubscription from './CurrentSubscription';

export default class Payments extends React.Component {
	state = {
		subscription: null
	}
	componentDidMount() {
		this.getSubscription();
	}

	createSubscription = (paymentMethod) => {
		const url = '/api/payments/subscriptions';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: JSON.stringify({
				planId: 'stripe-plan-startup',
				paymentMethod
			})
		}).then((response) => {
			if (!response.ok) {
				return response.json().then(err => { throw err })
			}
			return response.json();
		}).then((results) => {
			console.log('results ', results);
			
		}).catch((error) => {
			console.log('error ', error);
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

	render() {
		return (
		  <div className="container">
			<div>
			  <h2>Payments</h2>

			  <CurrentSubscription subscription={this.state.subscription}/>

			  <StripeProviderComponent
			  	user={this.props.user}
			  	createSubscription={this.createSubscription}
			  />
			</div>
		  </div>
		);
	}
}

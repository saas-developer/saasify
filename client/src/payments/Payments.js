import React from 'react';
import ElementsProvider from './ElementsProvider';

export default function Payments(props) {
	console.log('props ', props);
	const createSubscription = (paymentMethod, priceId) => {
		const url = '/api/payments/subscriptions';
		if (!priceId) {
			priceId = 'price_1HDuQq2YRaHTwzmSI4AkVjbw';
		}
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: JSON.stringify({
				paymentMethod,
				priceId 
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

	return (
		<div className="container">
			<div>
				<h2>Payments</h2>

				<ElementsProvider
					createSubscription={createSubscription}
				/>
			</div>
		</div>
	);
}

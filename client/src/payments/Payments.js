import React, { useEffect, useState } from 'react';
import ElementsProvider from './ElementsProvider';
import CurrentSubscription from './CurrentSubscription';
import { prices } from './productsAndPrices';

export default function Payments(props) {
	console.log('props ', props);
	useEffect(() => {
		getSubscription();
	}, []);
	const [subscription, setSubscription] = useState(null);

	const createSubscription = (paymentMethod, priceId) => {
		const url = '/api/payments/subscriptions';
		if (!priceId) {
			// priceId = 'price_1HDuQq2YRaHTwzmSI4AkVjbw'; // Enterprise
			priceId = 'price_1HDuQV2YRaHTwzmSVnVn5LXQ'; // Basic
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

	const getSubscription = () => {
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
			setSubscription(results.subscription);

		}).catch((error) => {
			console.log('error ', error);
			setSubscription(null);
		})
	}

	return (
		<div className="container">
			<div>
				<h2>Payments</h2>

				<CurrentSubscription
					subscription={subscription}
					prices={prices}
				/>

				<ElementsProvider
					createSubscription={createSubscription}
				/>
			</div>
		</div>
	);
}

import React, { useEffect, useState } from 'react';
import { Card, Form } from 'react-bootstrap';
import { prices } from './productsAndPrices';
import ElementsProvider from './ElementsProvider';
import _keys from 'lodash/keys';
import _get from 'lodash/get';

export default function CreateSubscription(props) {
	const priceIds = _keys(prices);
	const {
		subscription,
		card
	} = props;
	const currentPriceId = _get(subscription, 'plan.id', '');
	const [priceId, setPriceId] = useState(currentPriceId);

	useEffect(() => {
		setPriceId(currentPriceId);
	}, [currentPriceId]);

	const handleCreateSubscription = (paymentMethod) => {
		console.log('priceId', priceId)
		props.onPaymentMethodCreated(paymentMethod, priceId);
	}

	const handlePriceChange = (newPriceId) => {
		console.log('newPriceId.target.value', newPriceId.target.value)
		setPriceId(newPriceId.target.value);
	}

	return (
		<Card>
			<Card.Body>
				<h4>Create or Update subscription</h4>
				<div>
					<Form.Group controlId="plans">
					    <Form.Label>Plans</Form.Label>
					    <Form.Control
					    	as="select"
					    	value={priceId}
					    	onChange={handlePriceChange}
					    >
					      <option></option>
					      <option value={priceIds[0]}>{prices[priceIds[0]].displayName}</option>
					      <option value={priceIds[1]}>{prices[priceIds[1]].displayName}</option>
					      <option value={priceIds[2]}>{prices[priceIds[2]].displayName}</option>
					    </Form.Control>
					  </Form.Group>

					  {
					  	!card && <ElementsProvider
					  		createSubscription={handleCreateSubscription}
					  	/>
					  }

					  {
					  	card && <button
					  		onClick={() => handleCreateSubscription(null)}
					  	>Confirm order</button>
					  }
					  
				</div>
			</Card.Body>
		</Card>

	)
}

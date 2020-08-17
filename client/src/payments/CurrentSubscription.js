import React, { useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';

export default function CurrentSubscription(props) {
	const {
		subscription,
		prices
	} = props;

	if (!subscription) {
		return (
			<Card>
				<Card.Body>
					<div>You do not have any subscriptions yet</div>
				</Card.Body>
			</Card>
		)	
	}

	const getPlanName = (planId) => {
		return prices[planId]['displayName'];
	}

	return (
		<Card>
			<Card.Body>
				<h4>Subscription Details</h4>
				<div>
					Subscription ID
					<p>{subscription.id}</p>

					<div>Amount</div>
					<p>{(subscription.plan.amount / 100).toFixed(2)} {subscription.plan.currency.toUpperCase()}</p>

					<div>Plan Name</div>
					<p>{getPlanName(subscription.plan.id)}</p>

				</div>
				<Button
					onClick={props.deleteSubscription}
					variant="danger"
				>
					Delete Subscription
				</Button>
			</Card.Body>
		</Card>
	)
}
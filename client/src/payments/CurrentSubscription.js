import React, { useEffect } from 'react';

export default function Payments(props) {
	const {
		subscription,
		prices
	} = props;

	if (!subscription) {
		return (
			<div>You do not have any subscriptions yet</div>
		)	
	}

	const getPlanName = (planId) => {
		return prices[planId]['displayName'];
	}

	return (
		<div>
			Subscription ID
			<div>{subscription.id}</div>

			<div>Amount</div>
			<div>{(subscription.plan.amount / 100).toFixed(2)} {subscription.plan.currency.toUpperCase()}</div>

			<div>Plan Name</div>
			<div>{getPlanName(subscription.plan.id)}</div>

		</div>
	)
}
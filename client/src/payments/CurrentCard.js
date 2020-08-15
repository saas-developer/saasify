import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';

export default function CurrentCard(props) {
	const {
		card
	} = props;

	if (!card) {
		return (
			<div></div>
		)
	}

	const {
		brand,
		exp_month,
		exp_year,
		last4,
	} = card;


	return (
		<Card>
			<Card.Body>
				<h4>Card Details</h4>
				<div>
					<div>Card Brand</div>
					<p>{brand}</p>

					<div>Exp Month</div>
					<p>{exp_month}</p>

					<div>Exp Year</div>
					<p>{exp_year}</p>

					<div>Last4</div>
					<p>{last4}</p>

				</div>
			</Card.Body>
		</Card>
	)
}
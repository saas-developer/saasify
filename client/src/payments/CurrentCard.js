import React, { useEffect } from 'react';

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
		<div>
			<div>Card Brand</div>
			<div>{brand}</div>

			<div>Exp Month</div>
			<div>{exp_month}</div>

			<div>Exp Year</div>
			<div>{exp_year}</div>

			<div>Last4</div>
			<div>{last4}</div>

		</div>
	)
}
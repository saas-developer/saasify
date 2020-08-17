import React, { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import ElementsProvider from './ElementsProvider';


export default function UpdateCard(props) {
	return (
		<Card>
			<Card.Body>
				<h4>Update Card</h4>
				<div>
				<ElementsProvider
					onPaymentMethodCreated={props.onPaymentMethodCreated}
			  	/>
					
				</div>
			</Card.Body>
		</Card>
	)
}
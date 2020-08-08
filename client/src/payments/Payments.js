import React from 'react';
import ElementsProvider from './ElementsProvider';

export default function Payments(props) {
	console.log('props ', props);
	return (
		<div className="container">
			<div>
				<h2>Payments</h2>

				<ElementsProvider />
			</div>
		</div>
	);
}

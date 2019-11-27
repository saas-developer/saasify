import React, { Component } from 'react';
import { withRouter } from 'react-router';

export class HomePage extends Component {
	componentDidMount() {
		console.log('this.props ', this.props);

		setTimeout(() => {
			this.props.history.push('/login');
		}, 5000)
	}
	render() {
		return (
			<div>This is the HomePage component</div>
		);
	}
}

export default withRouter(HomePage);

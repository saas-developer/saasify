import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class ResetPasswordLink extends Component {
	state = {
		email: ''
	}

	handleEmailChange = (event) => {
		this.setState({
			email: event.target.value
		})
	}

	handleSubmitClick = () => {
		// Submit the email and password to the server
		const url = '/api/reset-password-link';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: JSON.stringify({
				email: this.state.email
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


	render() {
		return (
			<div className="container">
			<h2>Reset Password Link</h2>
			<div>
				<Form>
				  <Form.Group controlId="formBasicEmail">
				    <Form.Label>Email address</Form.Label>
				    <Form.Control
				    	type="email"
			    		placeholder="Enter email"
			    		onChange={this.handleEmailChange}
			    		value={this.state.email}
			    	/>
				    <Form.Text className="text-muted">
				      This account should already exist in our database.
				    </Form.Text>
				  </Form.Group>

				  <Button
				  	variant="primary"
				  	type="button"
				  	onClick={this.handleSubmitClick}
				  >
				    Submit
				  </Button>

				</Form>
			</div>
		</div>
		);
	}
}

export default ResetPasswordLink;

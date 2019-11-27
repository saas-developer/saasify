import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export class Register extends Component {
	state = {
		email: '',
		password: ''
	}

	handleEmailChange = (event) => {
		this.setState({
			email: event.target.value
		})
	}
	handlePasswordChange = (event) => {
		this.setState({
			password: event.target.value
		})
	}

	handleSubmitClick = () => {
		// Submit the email and password to the server
		const url = '/api/register';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: JSON.stringify({
				email: this.state.email,
				password: this.state.password
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
				<h2>Register</h2>
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
					      We'll never share your email with anyone else.
					    </Form.Text>
					  </Form.Group>

					  <Form.Group controlId="formBasicPassword">
					    <Form.Label>Password</Form.Label>
					    <Form.Control
					    	type="password"
					    	placeholder="Password"
					    	onChange={this.handlePasswordChange}
					    	value={this.state.password}
					    />
					  </Form.Group>
					  <Form.Group controlId="formBasicCheckbox">
					    <Form.Check type="checkbox" label="Check me out" />
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

export default Register;

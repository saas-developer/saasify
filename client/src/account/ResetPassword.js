import React, { Component } from 'react';
import queryString from 'query-string';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import './account.scss';

class ResetPassword extends Component {
	state = {
		resetPasswordToken: '',
		busy: false,
		password: ''
	}

	componentDidMount() {
		// Get token from URL
		const queryStringParams = queryString.parse(this.props.location.search) || {};
		const token = queryStringParams.token;

		this.setState({
			resetPasswordToken: token
		})
	}

	handlePasswordChange = (event) => {
		this.setState({
			password: event.target.value
		})
	}

	handleSubmitClick = () => {
		// Submit the email and password to the server
		const url = '/api/reset-password';
		
		fetch(url, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			credentials: 'same-origin',
			method: 'POST',
			body: JSON.stringify({
				resetPasswordToken: this.state.resetPasswordToken,
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
				<div className="form-container">
					<h2>Reset Password</h2>
					<div>
						<Form>
						  <Form.Group controlId="formBasicPassword">
						    <Form.Label>Password</Form.Label>
						    <Form.Control
						    	type="password"
					    		placeholder="Enter password"
					    		onChange={this.handlePasswordChange}
					    		value={this.state.password}
					    	/>
						    <Form.Text className="text-muted">
						      Please enter your new password
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
					<div className="actions-container">
						<div>
							<div>Try Login again?</div>
							<div><Link to="/login">Login</Link></div>
						</div>
						
					</div>
				</div>
			</div>
		);
	}
}

export default ResetPassword;

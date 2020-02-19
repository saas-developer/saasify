import React, { Component } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Errors from '../common/Errors';
import { NotificationManager } from 'react-notifications';
import './account.scss';

export class Register extends Component {
	state = {
		email: '',
		password: '',
        success: false,
        error: false,
        errors: null
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
        this.setState({
            success: false,
            error: false,
            errors: []
        })
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
            this.setState({
                success: true,
                error: false,
                errors: null
            })
		}).catch((error) => {
			console.log('error ', error);
            this.setState({
                success: false,
                error: true,
                errors: error.errors
            })
		})
	}


	render() {
		return (
			<div className="container">
				<div className="form-container">
					<h2>Register</h2>
					<div>
						<Form>
                          {
                            this.state.success &&
                            <Alert variant="success">
                                <div>Successfully registered your account.</div>
                                <div>You need to confirm your email address before logging in.</div>
                            </Alert>

                          }
                          {
                            this.state.errors && <Errors errors={this.state.errors} />
                          }
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
						<div>Already have an account?</div>
						<div><Link to="/login">Login</Link></div>
					</div>
				</div>
			</div>
		);
	}
}

export default Register;

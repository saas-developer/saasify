import React, { Component } from 'react';
import queryString from 'query-string';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Errors from '../common/Errors';
import './account.scss';

class ResetPassword extends Component {
	state = {
		resetPasswordToken: '',
		busy: false,
		password: '',
        success: false,
        error: false,
        errors: null
	}

	componentDidMount() {
		// Get token from URL
		const queryStringParams = queryString.parse(this.props.location.search) || {};
		const token = queryStringParams.token;

        if (!token) {
            this.setState({
                success: false,
                error: true,
                errors: [{
                    message: 'You need to generate a Reset Password Token before resetting your password'
                }]
            })
        }

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
        this.setState({
            success: false,
            error: false,
            errors: null
        })

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
                errors: error && error.errors
            })

		})
	}

	render() {
		return (
			<div className="container">
				<div className="form-container">
					<h2>Reset Password</h2>
					<div>
						<Form>
                          {
                            this.state.success &&
                            <Alert variant="success">
                                <div>Your password has been updated. Please proceed to the login page to Sign In</div>
                                <div><Link to="/login">Login</Link></div>
                            </Alert>

                          }    
                          {
                            this.state.errors && <Errors errors={this.state.errors} />
                          }
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

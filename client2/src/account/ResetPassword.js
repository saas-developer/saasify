import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Errors from '../common/Errors';
import './account.scss';

export default function ResetPassword(props) {
    const [password, setPassword] = useState('');
    const [resetPasswordToken, setResetPasswordToken] = useState('');
    const [apiState, setApiState] = useState({
        success: false,
        error: false,
        errors: []
    })

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    useEffect(() => {
        // Get token from URL
        const queryStringParams = queryString.parse(props.location.search) || {};
        const token = queryStringParams.token;

        if (!token) {
            setApiState({
                success: false,
                error: true,
                errors: [{
                    message: 'You need to generate a Reset Password Token before resetting your password'
                }]
            })

            
        }

        setResetPasswordToken(token);
    }, []);

    const handleSubmitClick = () => {
        setApiState({
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
                resetPasswordToken: resetPasswordToken,
                password: password
            })
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw err })
            }
            return response.json();
        }).then((results) => {
            console.log('results ', results);
            setApiState({
                success: true,
                error: false,
                errors: null
            })
            
        }).catch((error) => {
            console.log('error ', error);
            setApiState({
                success: false,
                error: true,
                errors: error.errors
            })
        })

    }

    const {
        success,
        errors
    } = apiState;

    return (
        <div className="container">
            <div className="form-container">
                <h2>Reset Password</h2>
                <div>
                    <Form>
                      {
                        success &&
                        <Alert variant="success">
                            <div>Your password has been updated. Please proceed to the login page to Sign In</div>
                            <div><Link to="/login">Login</Link></div>
                        </Alert>
                      }    
                      {
                        errors && <Errors errors={errors} />
                      }
                      <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter password"
                            onChange={handlePasswordChange}
                            value={password}
                        />
                        <Form.Text className="text-muted">
                          Please enter your new password
                        </Form.Text>
                      </Form.Group>

                      <Button
                        variant="primary"
                        type="button"
                        onClick={handleSubmitClick}
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

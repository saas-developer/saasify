import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { NotificationManager } from 'react-notifications';
import Errors from '../common/Errors';
import './account.scss';

export default function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [apiState, setApiState] = useState({
        success: false,
        error: false,
        errors: []
    })

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleSubmitClick = () => {
        setApiState({
            success: false,
            error: false,
            errors: null
        })

        // Submit the email and password to the server
        const url = '/api/login';
        
        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({
                email: email,
                password: password
            })
        }).then((response) => {
            if (!response.ok) {
                return response.json().then(err => { throw err })
            }
            return response.json();
        }).then((results) => {
            console.log('results ', results);
            const token = results.token;

            Cookies.set('token', token, {
                expires: 7
            })
            NotificationManager.success('You have successfully logged in', 'Login Success');
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        }).catch((error) => {
            console.log('error ', error);
            setApiState({
                success: false,
                error: true,
                errors: error.errors
            });
        })
    }

    const {
        errors
    } = apiState;

    return (
        <div className="container">
            <div className="form-container">
                <h2>Login</h2>
                <div>
                    <Form>
                      {
                        errors && <Errors errors={errors} />
                      }
                      <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            onChange={handleEmailChange}
                            value={email}
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
                            onChange={handlePasswordChange}
                            value={password}
                        />
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
                        <div>Don't have an account?</div>
                        <div><Link to="/register">Register</Link></div>
                    </div>
                    <div>
                        <div>Trouble Signing Up?</div>
                        <div><Link to="/account/reset-password-link">Reset Password</Link></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

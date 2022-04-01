import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Errors from '../common/Errors';
import './account.scss';

export default function ResetPasswordLink(props) {
    const [email, setEmail] = useState('');
    const [apiState, setApiState] = useState({
        success: false,
        error: false,
        errors: []
    })

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    const handleSubmitClick = () => {
        setApiState({
            success: false,
            error: false,
            errors: null
        })

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
                email
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
                <h2>Reset Password Link</h2>
                <div>
                    <Form>
                      {
                        success &&
                        <Alert variant="success">
                            <div>Please check your email for the link to reset your password</div>
                        </Alert>

                      }    
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
                          This account should already exist in our database.
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
                    <div className="actions-container">
                        <div>
                            <div>Try Login again?</div>
                            <div><Link to="/login">Login</Link></div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );


}

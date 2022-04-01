import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Errors from '../common/Errors';
import './account.scss';

export default function ResendActivationLink(props) {
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
        const url = '/api/resend-activation-link';
        
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
                <h2>Resend Activation Link</h2>
                <div>
                    <Form>
                      {
                        success &&
                        <Alert variant="success">
                            <div>Activation Link has been sent</div>
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
                </div>
                <div className="actions-container">
                    <div>
                        <div>Already have an account?</div>
                        <div><Link to="/login">Login</Link></div>
                    </div>
                    <div>
                        <div>Don't have an account?</div>
                        <div><Link to="/register">Register</Link></div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}


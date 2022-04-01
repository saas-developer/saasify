import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';

export default function AccountActivation(props) {
    const [busy, setBusy] = useState(false);
    const [apiState, setApiState] = useState({
        success: false,
        error: false,
        errors: []
    })
    console.log('props', props);

    useEffect(() => {
        // Get token from URL
        const queryStringParams = queryString.parse(props.location.search) || {};
        const token = queryStringParams.token;

        if (!token) {
            setBusy(false);
            setApiState({
                success: false,
                error: true,
                errors: []
            })

            return;

        }

        setBusy(true);

        const url = '/api/account-activate';

        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({
                activationToken: token
            })
        }).then((response) => {
            setBusy(false);
            if (!response.ok) {
                return response.json().then(err => { throw err })
            }
            return response.json();
        }).then((results) => {
            setApiState({
                success: true,
                error: false,
                errors: []
            })
            console.log('results ', results);

        }).catch((error) => {
            setApiState({
                success: false,
                error: true,
                errors: error.errors
            })
            console.log('error ', error);
        })
    }, []);

    const {
        success,
        error
    } = apiState;

    return (
        <div className="container">
            {
                busy ?
                <div>Activating Account ....</div> :
                null
            }
            {
                error && 
                (
                    <div>
                        <Alert variant="danger">
                            An error occurred. Perhaps you requested a new token?
                        </Alert>
                        <div>
                            <Link to="/resend-activation-token">Reuqest a new Activation Token</Link>
                        </div>

                    </div>
                 )

            }

            {
                success && 
                (
                    <div>
                        <Alert variant="success">
                            Successfully activated your account. Please proceed to the Login page to Sign In
                        </Alert>
                        <div>
                            <Link to="/login">Login</Link>
                        </div>

                    </div>


                )
            }

        </div>
    )

}

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Logout(props) {
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    useEffect(() => {
        Cookies.remove('token');
        setIsLoggedOut(true);
    }, []);

    return (
        <div className="container">
            <div className="form-container">
            {
                isLoggedOut ?
                <div>You are logged out</div> :
                <div>You are logged in</div>
            }
            </div>
        </div>
    );

}

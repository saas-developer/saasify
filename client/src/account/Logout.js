import React from 'react';
import Cookies from 'js-cookie';

class Logout extends React.Component {
    state = {
        isLoggedOut: false
    }
    componentDidMount() {
        Cookies.remove('token');
        this.setState({
            isLoggedOut: true
        })
    }
    render() {
        return (
            <div className="container">
                <div className="form-container">
                {
                    this.state.isLoggedOut ?
                    <div>You are logged out</div> :
                    <div>You are logged in</div>
                }
                </div>
            </div>
        );
    }
}

export default Logout;

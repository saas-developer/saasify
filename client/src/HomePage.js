import React, { Component } from 'react';
import { withRouter } from 'react-router';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';

export class HomePage extends Component {
	render() {
		return (
			<div className="container">
				<h2>Welcome Home</h2>
				<ListGroup>
				  <ListGroup.Item>
				  	<Link to="register">Register</Link>
				  </ListGroup.Item>
				  <ListGroup.Item>
				  	<Link to="login">Login</Link>
				  </ListGroup.Item>
                  <ListGroup.Item>
                    <Link to="logout">Logout</Link>
                  </ListGroup.Item>
				  <ListGroup.Item>
				  	<Link to="/account/activate">Activate</Link>
				  </ListGroup.Item>
				  <ListGroup.Item>
				  	<Link to="/account/resend-activation-link">Resend Activation Link</Link>
				  </ListGroup.Item>
				  <ListGroup.Item>
				  	<Link to="/account/reset-password-link">Reset Password Link</Link>
				  </ListGroup.Item>
				  <ListGroup.Item>
				  	<Link to="/account/reset-password">Reset Password</Link>
				  </ListGroup.Item>
				  <ListGroup.Item>
				  	<Link to="/payments">Payments</Link>
				  </ListGroup.Item>
				</ListGroup>
			</div>
		);
	}
}

export default withRouter(HomePage);

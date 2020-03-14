import React from 'react';
import { withRouter } from 'react-router';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import _get from 'lodash/get';

function HomePage() {
    const auth  = useSelector(state => state.auth);
    const email = _get(auth, 'user.email');

	return (
		<div className="container">
			<h2>{email ? `Welcome ${email}` : 'Welcome Home'}</h2>
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

export default withRouter(HomePage);

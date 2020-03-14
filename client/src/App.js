import React from 'react';
import {
	Route
} from 'react-router-dom';
import HomePage from './HomePage';
import Register from './account/Register';
import AccountActivation from './account/AccountActivation';
import ResendActivationLink from './account/ResendActivationLink';
import ResetPasswordLink from './account/ResetPasswordLink';
import ResetPassword from './account/ResetPassword';
import Login from './account/Login';
import Logout from './account/Logout';
import Header from './header/Header'
import Payments from './payments/Payments';
import { NotificationContainer } from 'react-notifications';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchLoggedInUser } from './account/actionsAuth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-notifications/dist/react-notifications.css';
import './App.scss';

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    fetchLoggedInUser
  }, dispatch);
};

class App extends React.Component {
  state = {
	user: null
  }

  componentDidMount() {
    this.props.fetchLoggedInUser();
  }

  render() {
	return (
	  <div className="app">
        <NotificationContainer />
		<header className="app-header">
		  <Header />
		</header>
		<div className="app-container">
		  <Route exact path="/" component={HomePage} />
		  <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />
		  <Route exact path="/register" component={Register} />
		  <Route exact path="/account/activate" component={AccountActivation} />
		  <Route exact path="/account/resend-activation-link" component={ResendActivationLink} />
		  <Route exact path="/account/reset-password-link" component={ResetPasswordLink} />
		  <Route exact path="/account/reset-password" component={ResetPassword} />
		  <Route
		    exact
		    path="/payments"
		    render={(props) => <Payments {...props} user={this.state.user} /> }
		  />
		</div>
	  </div>
	);
  }
}

export default connect(null, mapDispatchToProps)(App);

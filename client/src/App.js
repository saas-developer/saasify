import React from 'react';
import logo from './logo.svg';
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
import Header from './header/Header'
import Payments from './payments/Payments';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

class App extends React.Component {
  state = {
	user: null
  }

  componentDidMount() {
	const url = '/api/logged-in-user';

	fetch(url, {
	  headers: {
		'Accept': 'application/json',
		'Content-Type': 'application/json'
	  },
	  credentials: 'same-origin',
	  method: 'GET'
	}).then((response) => {
	  if (!response.ok) {
		return response.json().then(err => { throw err })
	  }
	  return response.json();
	}).then((results) => {
	  console.log('results ', results);
	  const user = results.user;

	  this.setState({
		user
	  })

	  
	}).catch((error) => {
	  console.log('error ', error);
	})
  }

  render() {
	return (
	  <div className="app">
		<header className="app-header">
		  <Header />
		</header>
		<div className="app-container">
		  <Route exact path="/" component={HomePage} />
		  <Route exact path="/login" component={Login} />
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

export default App;

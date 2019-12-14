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

function App() {
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
      <Route exact path="/payments" component={Payments} />
      </div>


    </div>
  );
}

export default App;

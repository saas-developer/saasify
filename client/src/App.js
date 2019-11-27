import React from 'react';
import logo from './logo.svg';
import {
	Route
} from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';
import Register from './account/Register';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        This is the Header component
      </header>

	  <Route exact path="/" component={HomePage} />
	  <Route exact path="/login" component={Login} />
	  <Route exact path="/register" component={Register} />

    </div>
  );
}

export default App;

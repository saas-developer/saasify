import React from 'react';
import logo from './logo.svg';
import './App.scss';
import {
	Route
} from 'react-router-dom';
import HomePage from './HomePage';
import Login from './Login';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        This is the Header component
      </header>

	  <Route exact path="/" component={HomePage} />
	  <Route exact path="/login" component={Login} />

    </div>
  );
}

export default App;

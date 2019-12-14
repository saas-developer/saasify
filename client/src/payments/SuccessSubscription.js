import React from 'react';
import { Link } from 'react-router-dom';

export default class SuccessSubscription extends React.Component {
  render() {
    return (
      <div className="container">
        <div>You have successfully subscribed to a plan</div>
        <Link to="/payments">Back to Payments</Link>
      </div>
    );
  }
}

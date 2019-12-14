import React from 'react';
import CreateSubscription from './CreateSubscription';

export default class Payments extends React.Component {
  render() {
    return (
      <div className="container">
        <h2>Payments</h2>

        <div>
          You do not have any active subscriptions.
        </div>

        <CreateSubscription />
      </div>
    );
  }
}

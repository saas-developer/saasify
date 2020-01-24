import React from 'react';
import StripeProviderComponent from './StripeProviderComponent';

export default class Payments extends React.Component {
  render() {
    return (
      <div className="container">
        <div>
          <h2>Payments</h2>

          <StripeProviderComponent user={this.props.user} />
        </div>
      </div>
    );
  }
}

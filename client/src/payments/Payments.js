import React from 'react';
import CreateSubscription from './CreateSubscription';

export default class Payments extends React.Component {
  componentDidMount() {
    console.log('this.props', this.props);
  }

  render() {
    const {
      user
    } = this.props;
    // Use lodash instead
    const currentPlan = user && user.stripeDetails && user.stripeDetails.plan && user.stripeDetails.plan.nickname;

    return (
      <div className="container">
        <h2>Payments</h2>

        <div>
          {
            currentPlan ?
            <p>Your current plan is {currentPlan}</p> :
            <p>You do not have any active subscriptions.</p>
          }
        </div>

        <CreateSubscription user={this.props.user}/>
      </div>
    );
  }
}

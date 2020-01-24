import React from 'react';

export default class CurrentSubscription extends React.Component {
    render() {
        const {
            subscription
        } = this.props;
        if (!subscription) {
            return (
                <div>You do not have any subscriptions yet.</div>
            )
        }

        const nickname = subscription.plan.nickname;
        const amount = subscription.plan.amount;
        const interval = subscription.plan.interval;
        

        return (
            <div>
                <div>You are subscribed to</div>
                <p>{nickname}</p>
                <div>We will charge you</div>
                <p>{amount}</p>
                <div>Interval</div>
                <p>{interval}</p>
            </div>
        );
    }
}

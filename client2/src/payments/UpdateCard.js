import React from 'react';
import Card from 'react-bootstrap/Card';
import StripeProviderComponent from './StripeProviderComponent';

export default class UpdateCard extends React.Component {
    render() {
        return (
            <Card className="mb-4">
              <Card.Body>
                <h4>Update Card</h4>
                <div>
                    <StripeProviderComponent
                        user={this.props.user}
                        onPaymentMethodCreated={this.props.onPaymentMethodCreated}
                        actionButtonText={"Update Card"}
                    />
                </div>
              </Card.Body>
            </Card>
        );
    }
}

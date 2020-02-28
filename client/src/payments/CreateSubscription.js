import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import StripeProviderComponent from './StripeProviderComponent';
import Card from 'react-bootstrap/Card';
import _get from 'lodash/get';

export default class CreateSubscription extends React.Component {
    handlePlanChange = (event) => {
        this.props.setPlan(event.target.value)
    }

    createSubscription = () => {
        this.props.onPaymentMethodCreated();
    }

    render() {
        const {
            user
        } = this.props;

        const hasSubscription = _get(user, 'stripeDetails.subscription.status', '') === 'active';

        return (
            <Card className="mb-4">
              <Card.Body>
                {
                    hasSubscription ?
                    <h4>Update your subscription</h4> :
                    <h4>Subscribe to a plan</h4>
                }
                    <div>
                        <Form>
                          <Form.Group controlId="stripeForm.planSelect">
                            <Form.Label>Select your plan</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={this.handlePlanChange}
                                value={this.props.plan}
                            >
                              <option value="">Select your plan</option>
                              <option value="stripe-plan-basic">Basic</option>
                              <option value="stripe-plan-startup">Startup</option>
                              <option value="stripe-plan-enterprise">Enterprise</option>
                            </Form.Control>
                          </Form.Group>
                        </Form>
                        {
                            !this.props.card &&
                            <StripeProviderComponent
                                user={this.props.user}
                                onPaymentMethodCreated={this.props.onPaymentMethodCreated}
                                actionButtonText={"Subscribe"}
                            />
                        }

                        {
                            this.props.card &&
                            <Button
                              variant="primary"
                              type="button"
                              onClick={this.createSubscription}
                            >
                              {this.props.actionButtonText}
                            </Button>
                        }

                        
                        
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

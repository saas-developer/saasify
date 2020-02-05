import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import StripeProviderComponent from './StripeProviderComponent';
import Card from 'react-bootstrap/Card';

export default class CreateSubscription extends React.Component {
    handlePlanChange = (event) => {
        this.props.setPlan(event.target.value)
    }

    createSubscription = () => {
        this.props.createSubscription();
    }

    render() {
        return (
            <Card>
              <Card.Body>
                <h4>Your card details</h4>
                    <div>
                        <Form>
                          <Form.Group controlId="stripeForm.planSelect">
                            <Form.Label>Select your plan</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={this.handlePlanChange}
                                value={this.props.plan}
                            >
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
                                createSubscription={this.props.createSubscription}
                            />
                        }

                        {
                            this.props.card &&
                            <Button
                              variant="primary"
                              type="button"
                              onClick={this.createSubscription}
                            >
                              Subscribe
                            </Button>
                        }

                        
                        
                    </div>
                </Card.Body>
            </Card>
        );
    }
}

import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default class CreateSubscription extends React.Component {
  state = {
    selectedPlan: ''
  }

  handlePlanChange = (event) => {
    this.setState({
      selectedPlan: event.target.value 
    });

  }

  handleSubmitClick = () => {

  }

  render() {
    return (
      <div>
        <Form>
          <Form.Group controlId="selectPlan">
            <Form.Label>Select Plan</Form.Label>
            <Form.Control
              as="select"
              value={this.state.selectedPlan}
              onChange={this.handlePlanChange}
            >
              <option value="stripe-plan-basic">Basic</option>
              <option value="stripe-plan-enterprise">Enterprise</option>
              <option value="stripe-plan-startup">Startup</option>
            </Form.Control>
          </Form.Group>
          <Button
            variant="info"
            onClick={this.handleSubmitClick}
          >Subscribe</Button>
        </Form>
      </div>
    );
  }
}

import React from 'react';
import Alert from 'react-bootstrap/Alert';
import _map from 'lodash/map';

export default class Errors extends React.Component {
    render() {
        const {
            errors
        } = this.props;

        const errorMessages = _map(errors, 'message');

        return (
            <div>
                {
                    _map(errorMessages, (error, index) => {
                        return (
                            <Alert key={index} variant="danger">
                                {error}
                            </Alert>
                        )
                    })
                }
            </div>
        );
    }
}

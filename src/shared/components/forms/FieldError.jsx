import React from 'react';
import PropTypes from 'prop-types';
import { HelpBlock } from 'react-bootstrap';

export default class FieldError extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
  };

  static contextTypes = {
    form: PropTypes.object.isRequired,
  };

  render() {
    const message = this.context.form.getValidationErrors(this.props.name);
    return message ? <HelpBlock>{message}</HelpBlock> : null;
  }
}

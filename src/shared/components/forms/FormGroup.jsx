import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup } from 'react-bootstrap';

export default class ValidationFormGroup extends React.Component {
  static propTypes = {
    name: PropTypes.string, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    name: '',
  };

  static contextTypes = {
    form: PropTypes.object.isRequired,
  };

  render() {
    const { name, ...others } = this.props;
    const hasError = name && this.context.form.getValidationErrors(name);
    return <FormGroup {...others} validationState={hasError ? 'error' : null} />;
  }
}

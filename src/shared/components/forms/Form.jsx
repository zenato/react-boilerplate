import React, { PropTypes } from 'react';
import validate from 'validate.js';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';

export default class ValidationForm extends React.Component {
  static propTypes = {
    constraints: PropTypes.shape({}),
    onValidationError: PropTypes.func,
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    constraints: {},
    onValidationError: () => {},
    onChange: () => {},
    onSubmit: () => {},
  };

  static childContextTypes = {
    form: PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);

    this.validation = {
      options: { fullMessages: false },
    };
    this.formControls = [];

    this.state = {
      validationErrors: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.attachFormControl = this.attachFormControl.bind(this);
    this.getValues = this.getValues.bind(this);
    this.setValues = this.setValues.bind(this);
    this.getValidationErrors = this.getValidationErrors.bind(this);
  }

  getChildContext() {
    return {
      form: {
        attachFormControl: this.attachFormControl,
        getValidationErrors: this.getValidationErrors,
        onChange: this.handleChange,
        onBlur: this.handleBlur,
      },
    };
  }

  getValues() {
    const values = {};
    this.formControls.forEach((formControl) => {
      values[formControl.props.name] = formControl.getValue();
    });
    return values;
  }

  setValues(values) {
    this.formControls.forEach((formControl) => {
      formControl.setValue(values[formControl.props.name]);
    });
    this.setState({ validationErrors: {} });
    this.props.onValidationError(this.state.validationErrors);
  }

  getValidationErrors(name) {
    return name ? this.state.validationErrors[name] : this.state.validationErrors;
  }

  handleSubmit(e) {
    e.preventDefault();
    const { constraints, onValidationError } = this.props;
    const values = this.getValues();
    const validationErrors = validate(values, constraints, this.validation.options) || {};
    this.setState({ validationErrors });
    onValidationError(validationErrors);
    if (isEmpty(validationErrors)) {
      this.formControls.forEach(el => (el.blur && el.blur()));
      this.props.onSubmit(values);
    }
  }

  handleChange(e) {
    this.setState({
      validationErrors: {
        ...this.state.validationErrors,
        [e.target.name]: null,
      },
    });
    this.props.onValidationError(this.state.validationErrors);
    this.props.onChange();
  }

  handleBlur(e) {
    const { name } = e.target;
    const constraint = { [name]: this.props.constraints[name] };
    const prevErrors = this.state.validationErrors;
    const fieldError =
      validate(this.getValues(), constraint, this.validation.options) || { [name]: null };
    const validationErrors = {
      ...prevErrors,
      ...fieldError,
    };

    this.setState({ validationErrors });
    this.props.onValidationError(validationErrors);
  }

  attachFormControl(component) {
    this.formControls.push(component);
  }

  render() {
    const props = omit(this.props, ['constraints', 'onValidationError']);
    return (
      <form {...props} onSubmit={this.handleSubmit} />
    );
  }
}

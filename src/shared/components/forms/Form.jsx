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
      errors: {},
      options: { fullMessages: false },
    };
    this.formControls = [];

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.attachFormControl = this.attachFormControl.bind(this);
    this.getValues = this.getValues.bind(this);
    this.setValues = this.setValues.bind(this);
  }

  getChildContext() {
    return {
      form: {
        attachFormControl: this.attachFormControl,
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
    this.validation.errors = {};
    this.props.onValidationError(this.validation.errors);
  }

  handleSubmit(e) {
    e.preventDefault();

    const { constraints, onValidationError } = this.props;
    const values = this.getValues();

    this.validation.errors = validate(values, constraints, this.validation.options) || {};
    onValidationError(this.validation.errors);
    if (isEmpty(this.validation.errors)) {
      this.formControls.forEach(el => (el.blur && el.blur()));
      this.props.onSubmit(values);
    }
  }

  handleChange(e) {
    this.validation.errors[e.target.name] = null;
    this.props.onValidationError(this.validation.errors);
    this.props.onChange();
  }

  handleBlur(e) {
    const { name } = e.target;
    const constraint = { [name]: this.props.constraints[name] };
    const prevState = this.validation.errors;
    const validation =
      validate(this.getValues(), constraint, this.validation.options) || { [name]: null };

    this.validation.errors = {
      ...prevState,
      ...validation,
    };
    this.props.onValidationError(this.validation.errors);
  }

  attachFormControl(component) {
    this.formControls.push(component);
  }

  render() {
    const props = omit(this.props, ['constraints', 'onValidationError']);
    return (
      <form
        {...props}
        onSubmit={this.handleSubmit}
      />
    );
  }
}

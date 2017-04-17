import React from 'react';
import PropTypes from 'prop-types';

export default class TextArea extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
  };

  static defaultProps = {
    className: 'form-control',
    onChange: () => {},
    onBlur: () => {},
  };

  static contextTypes = {
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    this.context.form.attachFormControl(this);
  }

  getValue() {
    return this.textarea.value.trim();
  }

  setValue(value, defaultValue = '') {
    this.textarea.value = value || defaultValue;
  }

  handleChange(e) {
    this.context.form.onChange(e);
    this.props.onChange(e);
  }

  handleBlur(e) {
    this.context.form.onBlur(e);
    this.props.onBlur(e);
  }

  render() {
    const { name, ...props } = this.props;

    return (
      <textarea
        {...props}
        name={name}
        ref={c => (this.textarea = c)}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

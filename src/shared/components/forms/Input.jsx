import React, { PropTypes } from 'react';

export default class Input extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
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
    return this.input.value.trim();
  }

  setValue(value, defaultValue = '') {
    this.input.value = value || defaultValue;
  }

  blur() {
    this.input.blur();
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
      <input
        {...props}
        name={name}
        ref={c => (this.input = c)}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }
}

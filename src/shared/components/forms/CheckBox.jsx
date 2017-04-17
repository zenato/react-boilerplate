import React from 'react';
import PropTypes from 'prop-types';

export default class CheckBox extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
  };

  static contextTypes = {
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    this.context.form.attachFormControl(this);
  }

  getValue() {
    return this.checkbox.checked ? this.checkbox.value : null;
  }

  setValue(value) {
    this.checkbox.checked = this.checkbox.value === value;
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  render() {
    const { name, ...props } = this.props;
    return (
      <input
        {...props}
        name={name}
        type="checkbox"
        ref={c => (this.checkbox = c)}
        onChange={this.handleChange}
      />
    );
  }
}

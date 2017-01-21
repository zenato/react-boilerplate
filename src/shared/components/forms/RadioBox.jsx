import React, { PropTypes } from 'react';

export default class RadioBox extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]),
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onChange: PropTypes.func,
  };

  static defaultProps = {
    onChange: () => {},
    defaultValue: null,
  };

  static contextTypes = {
    form: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.radioBoxes = [];
    this.handleChange = this.handleChange.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  componentDidMount() {
    this.context.form.attachFormControl(this);
  }

  getValue() {
    return this.radioBoxes.filter(ref => ref.checked)[0];
  }

  setValue(value) {
    this.radioBoxes.forEach((ref) => {
      ref.checked = ref.value === value; // eslint-disable-line no-param-reassign
    });
  }

  handleChange(e) {
    this.props.onChange(e);
  }

  render() {
    const { items, name, defaultValue } = this.props;

    return (
      <div>
        {items.map((item) => {
          const elementId = `radio-${name}-${item.value}`;
          return (
            <span>
              <label htmlFor={elementId}>{`${item.label} `}</label>
              <input
                {...this.props}
                type="radio"
                ref={c => this.radioBoxes.push(c)}
                id={elementId}
                key={item.value}
                value={item.value}
                defaultChecked={defaultValue === item.value}
                onChange={this.handleChange}
              />
            </span>
          );
        })}
      </div>
    );
  }
}

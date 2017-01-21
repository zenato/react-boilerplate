/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_creator"] }] */

import React, { Component, PropTypes } from 'react';
import dateFormat from 'dateformat';

export default class BoardListItem extends Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    item: PropTypes.shape({}).isRequired,
    onClick: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    return this.props.onClick(e.target.dataset.id);
  }

  render() {
    const { index, item } = this.props;
    return (
      <tr>
        <td>{index}</td>
        <td>
          <a href="" onClick={this.handleClick} data-id={item._id}>{item.title}</a>
        </td>
        <td>{item._creator.name}</td>
        <td>{dateFormat(item.createdAt, 'yyyy-mm-dd')}</td>
      </tr>
    );
  }
}

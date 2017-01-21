import React, { PropTypes } from 'react';
import RBPagination from 'react-bootstrap/lib/Pagination';

export default class Pagination extends React.Component {
  static propTypes = {
    pages: PropTypes.number,
    page: PropTypes.number,
    onSelect: PropTypes.func,
  };

  static defaultProps = {
    pages: null,
    page: null,
    onSelect: () => {},
  };

  render() {
    const { pages, page, onSelect } = this.props;

    return (!pages && !page) ? null : <RBPagination
      items={pages}
      activePage={page}
      onSelect={onSelect}
      style={{ marginTop: 0 }}
      first
      last
      prev
      next
    />;
  }
}

import React from 'react';
import PropTypes from 'prop-types';
import RBPagination from 'react-bootstrap/lib/Pagination';

const Pagination = ({ pages, page, onSelect }) => {
  if (!pages && !page) {
    return null;
  }
  return (
    <RBPagination
      items={pages}
      activePage={page}
      onSelect={onSelect}
      style={{ marginTop: 0 }}
      first
      last
      prev
      next
    />
  );
};

Pagination.propTypes = {
  pages: PropTypes.number,
  page: PropTypes.number,
  onSelect: PropTypes.func,
};

Pagination.defaultProps = {
  pages: null,
  page: null,
  onSelect: () => {},
};

export default Pagination;

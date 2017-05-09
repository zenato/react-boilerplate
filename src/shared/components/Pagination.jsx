// @flow

import React from 'react';
import RBPagination from 'react-bootstrap/lib/Pagination';

type Props = {
  pages?: number,
  page?: number,
  onSelect?: (page: number) => void,
};

const Pagination = ({ pages, page, onSelect }: Props) => {
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

Pagination.defaultProps = {
  pages: null,
  page: null,
  onSelect: () => {},
};

export default Pagination;

import React, { PropTypes } from 'react';
import PageHeader from 'react-bootstrap/lib/PageHeader';

const BoardApp = props => (
  <div>
    <PageHeader>Board</PageHeader>
    {props.children}
  </div>
);

BoardApp.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BoardApp;

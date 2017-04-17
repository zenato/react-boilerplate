import React from 'react';
import PropTypes from 'prop-types';
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

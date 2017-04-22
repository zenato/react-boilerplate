import React from 'react';
import PropTypes from 'prop-types';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import { renderRoutes } from '../../lib/router';

const BoardApp = ({ routes }) => (
  <div>
    <PageHeader>Board</PageHeader>
    {renderRoutes(routes)}
  </div>
);

BoardApp.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

export default BoardApp;

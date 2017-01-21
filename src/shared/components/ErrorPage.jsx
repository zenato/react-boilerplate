import React, { PropTypes } from 'react';

const ErrorPage = props => (
  <div>
    {props.error.status || 500} | {props.error.message || 'Internal server error.'}
  </div>
);

ErrorPage.propTypes = {
  error: PropTypes.shape({
    status: PropTypes.number,
    message: PropTypes.number,
  }),
};

ErrorPage.defaultProps = {
  error: {
    status: 404,
    message: 'Page not found.',
  },
};

export default ErrorPage;

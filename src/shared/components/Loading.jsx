import React, { PropTypes } from 'react';
import Alert from 'react-bootstrap/lib/Alert';

const Loading = ({ isFetching, error, renderFetching, renderError }) => {
  if (isFetching) {
    return renderFetching();
  }
  if (error) {
    return renderError(error);
  }
  return null;
};

Loading.propTypes = {
  isFetching: PropTypes.bool,
  error: PropTypes.shape({}),
  renderError: PropTypes.func,
};

Loading.defaultProps = {
  isFetching: false,
  error: null,
  renderFetching: () => <Alert bsStyle="warning">Loading...</Alert>,
  renderError: () => <Alert bsStyle="danger">Failure on request.</Alert>,
};

export default Loading;

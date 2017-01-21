import React from 'react';
import Helmet from 'react-helmet';

export default props => (
  <Helmet
    {...props}
    titleTemplate="%s | React Boilerplate"
    defaultTitle="React Boilerplate"
  />
);

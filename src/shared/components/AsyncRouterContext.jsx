import some from 'lodash/some';
import differenceBy from 'lodash/differenceBy';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { matchRoutes } from 'react-router-config';
import { Route } from 'react-router-dom';
import { loadComponents, applyHook } from '../lib/router';
import fetchData from '../lib/fetchData';

class AsyncRouterContext extends Component {
  static propTypes = {
    history: PropTypes.shape({
      action: PropTypes.string,
      replace: PropTypes.func.isRequired,
    }).isRequired,
    store: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    children: PropTypes.node.isRequired,
  };

  state = {
    previousLocation: null,
  };

  async componentWillReceiveProps(nextProps) {
    const { store, history, routes, location } = this.props;

    // Change location
    if (nextProps.location === location) {
      return;
    }

    if (nextProps.history.action !== 'REPLACE') {
      this.setState({ previousLocation: location });
    }

    // Analystics matched routes and chagned routes.
    const matchedRoutes = matchRoutes(routes, nextProps.location.pathname);
    const changedRoutes = differenceBy(matchedRoutes, this.routes, 'route');
    this.routes = matchedRoutes;

    // Apply route hook.
    const { url } = await applyHook(matchedRoutes, nextProps.location);
    if (url) {
      history.replace(url);
      return;
    }

    // Load components and fetch data.
    const components = await loadComponents(matchedRoutes);
    const fetchComponents = components.filter(({ route }) => some(changedRoutes, { route }));
    fetchData({
      store,
      components: fetchComponents,
      location: nextProps.location,
    });

    // Change location!!!
    this.setState({
      previousLocation: null,
    });
  }

  routes = matchRoutes(this.props.routes, this.props.location.pathname);

  render() {
    const { children, location } = this.props;
    const { previousLocation } = this.state;
    return (
      <Route
        location={previousLocation || location}
        render={() => children}
      />
    );
  }
}

export default withRouter(AsyncRouterContext);

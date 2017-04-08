import React from 'react';
import PropTypes from 'prop-types';
import RouterContext from 'react-router/lib/RouterContext';
import difference from 'lodash/difference';
import isFunction from 'lodash/isFunction';
import ComponentProvider from './ComponentProvider';
import fetchData from '../../lib/fetchData';
import { isChangedLocation } from '../../lib/router';

function createElement(Component, props) {
  return isFunction(Component.fetchData)
    ? <ComponentProvider Component={Component} routerProps={props} />
    : <Component {...props} />;
}

export default class RouterContextProvider extends React.Component {
  static childContextTypes = {
    provider: PropTypes.shape({
      reload: PropTypes.func.isRequired,
    }).isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired,
  };

  static propTypes = {
    components: PropTypes.arrayOf(PropTypes.any),
    params: PropTypes.shape({}),
    location: PropTypes.shape({}),
  };

  getChildContext() {
    return {
      provider: {
        reload: component => this.reload(component),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (isChangedLocation(this.props.location, nextProps.location)) {
      fetchData({
        components: difference(nextProps.components, this.props.components),
        location: nextProps.location,
        params: nextProps.params,
        store: this.context.store,
      });
    }
  }

  reload(component) {
    const store = this.context.store;
    const { params, location } = this.props;
    const components = component ? [component] : this.props.components;
    fetchData({ components, params, location, store });
  }

  render() {
    return <RouterContext {...this.props} createElement={createElement} />;
  }
}

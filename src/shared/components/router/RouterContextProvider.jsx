import React, { PropTypes } from 'react';
import RouterContext from 'react-router/lib/RouterContext';
import difference from 'lodash/difference';
import ComponentProvider from './ComponentProvider';
import fetchData from '../../lib/fetchData';

function createElement(Component, props) {
  return Component.fetchData
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
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }),
    render: PropTypes.func,
  };

  static defaultProps = {
    render(props) {
      return <RouterContext {...props} createElement={createElement} />;
    },
  };

  getChildContext() {
    return {
      provider: {
        reload: component => this.reload(component),
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    const currentUrl = this.props.location.pathname + this.props.location.search;
    const nextUrl = nextProps.location.pathname + nextProps.location.search;
    if (currentUrl !== nextUrl) {
      const store = this.context.store;
      const { params, location } = nextProps;
      const components = difference(nextProps.components, this.props.components);
      fetchData({ components, params, location, store });
    }
  }

  reload(component) {
    const store = this.context.store;
    const { params, location } = this.props;
    const components = component ? [component] : this.props.components;
    fetchData({ components, params, location, store });
  }

  render() {
    return this.props.render(this.props);
  }
}

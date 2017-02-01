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
    location: PropTypes.shape({}),
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
    if (this.props.location !== nextProps.location) {
      const store = this.context.store;
      const { params, location } = nextProps;
      if (!(location.state && location.state.preventFetchData)) {
        const components = difference(nextProps.components, this.props.components);
        if (components.length > 0) {
          fetchData({ components, params, location, store });
        }
      }
    }
  }

  reload(component) {
    const store = this.context.store;
    const { params, location } = this.props;
    if (!(location.state && location.state.preventFetchData)) {
      const components = component ? [component] : this.props.components;
      fetchData({ components, params, location, store });
    }
  }

  render() {
    return this.props.render(this.props);
  }
}

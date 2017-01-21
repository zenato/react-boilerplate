import React, { PropTypes } from 'react';

export default class ComponentProvider extends React.Component {
  static propTypes = {
    Component: PropTypes.func.isRequired,
    routerProps: PropTypes.shape({}).isRequired,
  };

  static contextTypes = {
    provider: PropTypes.object.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    const { routerProps, Component } = this.props;
    if (routerProps.location !== nextProps.routerProps.location
      && Component === nextProps.Component) {
      this.context.provider.reload(Component);
    }
  }

  render() {
    // eslint-disable-next-line no-use-before-define
    const { Component, routerProps, ...props } = this.props;
    const { reload } = this.context.provider;

    const handleReload = () => reload(Component);
    const handleReloadAll = () => reload();

    return (
      <Component
        {...props}
        {...routerProps}
        reload={handleReload}
        reloadAll={handleReloadAll}
      />
    );
  }
}

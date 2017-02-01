import React, { PropTypes } from 'react';

export default class ComponentProvider extends React.Component {
  static propTypes = {
    Component: PropTypes.func.isRequired,
    routerProps: PropTypes.shape({}).isRequired,
  };

  static contextTypes = {
    provider: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleReload = this.handleReload.bind(this);
  }

  handleReload(isFullReload) {
    this.context.provider.reload(isFullReload ? null : this.props.Component);
  }

  render() {
    const { Component, routerProps, ...props } = this.props;
    return (
      <Component
        {...props}
        {...routerProps}
        reload={this.handleReload}
      />
    );
  }
}

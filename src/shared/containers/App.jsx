import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { renderRoutes } from '../lib/router';
import { signOut } from '../state/actions/user';
import Header from '../components/Header';
import './App.css';

class App extends Component {
  static propTypes = {
    routes: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    user: PropTypes.shape({}).isRequired,
    signOut: PropTypes.func.isRequired,
  };

  handleSignOut = () => {
    this.props.signOut();
    window.location.href = '/';
  };

  render() {
    const { user, routes } = this.props;
    return (
      <div className="App">
        <Header user={user} signOut={this.handleSignOut} />
        <div id="container" className="container">
          {renderRoutes(routes)}
        </div>
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    user: state.user,
  }),
  dispatch => bindActionCreators({
    signOut,
  }, dispatch),
)(App));

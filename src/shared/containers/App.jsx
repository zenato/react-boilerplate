import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { signOut } from '../state/actions/user';
import Header from '../components/Header';
import './App.css';

class App extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    user: PropTypes.shape({}).isRequired,
    signOut: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.handleSignOut = this.handleSignOut.bind(this);
  }

  handleSignOut() {
    this.props.signOut();
    window.location.href = '/';
  }

  render() {
    const { user, children } = this.props;
    return (
      <div className="App">
        <Header user={user} signOut={this.handleSignOut} />
        <div id="container" className="container">{children}</div>
      </div>
    );
  }
}

export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => bindActionCreators({
    signOut,
  }, dispatch),
)(App);

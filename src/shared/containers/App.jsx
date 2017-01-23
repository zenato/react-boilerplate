import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import browserHistory from 'react-router/lib/browserHistory';
import { signOut, fetchMe } from '../state/actions/user';
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
    browserHistory.push({ pathname: '/' });
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
    fetchMe,
  }, dispatch),
)(App);

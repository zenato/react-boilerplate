import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { fetchMe } from '../state/actions/user';
import Header from '../components/Header';
import './App.css';

const App = ({ user, children }) => (
  <div className="App">
    <Header user={user} />
    <div id="container" className="container">{children}</div>
  </div>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
  user: PropTypes.shape({}).isRequired,
};

export default connect(
  state => ({
    user: state.user,
  }),
  dispatch => bindActionCreators({
    fetchMe,
  }, dispatch),
)(App);

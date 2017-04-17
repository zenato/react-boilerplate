import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import browserHistory from 'react-router/lib/browserHistory';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from '../../components/Helmet';
import Indicator from '../../components/Indicator';
import { Form, Input, FormGroup, FieldError } from '../../components/forms';
import { signIn } from '../../state/actions/user';

class SignIn extends Component {
  static propTypes = {
    model: PropTypes.shape({
      isFetching: PropTypes.bool,
      error: PropTypes.shape({}),
      signedInfo: PropTypes.shape({}),
    }).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        next: PropTypes.string,
      }),
    }).isRequired,
    signIn: PropTypes.func.isRequired,
  };

  static renderError(error) {
    let message = 'Failure on request.';
    if (error.status === 401) {
      message = 'Please check your account.';
    }
    return <Alert bsStyle="danger">{message}</Alert>;
  }

  constructor(props) {
    super(props);

    this.constraints = {
      email: { presence: { message: 'Required' } },
      password: { presence: { message: 'Required' } },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    if (this.props.model.isFetching) return;

    this.props.signIn(values).then(() => {
      const { location, model } = this.props;
      if (!model.error) {
        browserHistory.push({ pathname: location.query.next });
      }
    });
  }

  render() {
    const { isFetching, error } = this.props.model;

    return (
      <div>
        <Helmet title="Sign In" />

        <PageHeader>Sign In</PageHeader>

        <Indicator isFetching={isFetching} error={error} renderError={SignIn.renderError} />

        <Form
          ref={c => (this.form = c)}
          constraints={this.constraints}
          onSubmit={this.handleSubmit}
        >
          <FormGroup name="email">
            <ControlLabel>Email</ControlLabel>
            <Input type="text" name="email" placeholder="Email" />
            <FieldError name="email" />
          </FormGroup>
          <FormGroup name="password">
            <ControlLabel>Password</ControlLabel>
            <Input type="password" name="password" placeholder="Passowrd" />
            <FieldError name="password" />
          </FormGroup>
          <ButtonToolbar>
            <Button type="submit" bsStyle="primary" disabled={isFetching}>Sign In</Button>
          </ButtonToolbar>
        </Form>
      </div>
    );
  }
}

export default connect(
  state => ({
    model: state.user,
  }),
  dispatch => bindActionCreators({
    signIn,
  }, dispatch),
)(SignIn);

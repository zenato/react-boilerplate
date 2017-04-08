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
import { signUp } from '../../state/actions/user';

class SignUp extends Component {
  static propTypes = {
    model: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      error: PropTypes.shape({}),
      signedInfo: PropTypes.shape({}),
    }).isRequired,
    signUp: PropTypes.func.isRequired,
  };

  static renderError(error) {
    let message = 'Failure on request.';
    if (error.data && error.data.alreadyExists) {
      message = 'Already signed email.';
    }
    return <Alert bsStyle="danger">{message}</Alert>;
  }

  constructor(props) {
    super(props);

    this.constraints = {
      email: { presence: { message: 'Required' } },
      name: { presence: { message: 'Required' } },
      password: {
        presence: true,
        length: {
          minimum: 6,
          maximum: 20,
        },
      },
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(values) {
    if (this.props.model.isFetching) return;
    this.props.signUp(values).then(() => {
      if (!this.props.model.error) {
        browserHistory.push({ pathname: '/signIn' });
      }
    });
  }

  render() {
    const { isFetching, error } = this.props.model;

    return (
      <div>
        <Helmet title="Sign Up" />

        <PageHeader>Sign Up</PageHeader>

        <Indicator isFetching={isFetching} error={error} renderError={SignUp.renderError} />

        <Form
          ref={c => (this.form = c)}
          constraints={this.constraints}
          onSubmit={this.handleSubmit}
          onValidationError={this.handleValidationError}
        >
          <FormGroup name="email">
            <ControlLabel>Email</ControlLabel>
            <Input type="text" name="email" maxLength="80" placeholder="Email" />
            <FieldError name="email" />
          </FormGroup>
          <FormGroup name="name">
            <ControlLabel>Name</ControlLabel>
            <Input type="text" name="name" maxLength="100" placeholder="Name" />
            <FieldError name="name" />
          </FormGroup>
          <FormGroup name="password">
            <ControlLabel>Password</ControlLabel>
            <Input type="password" name="password" maxLength="20" placeholder="Password" />
            <FieldError name="password" />
          </FormGroup>
          <ButtonToolbar>
            <Button type="submit" bsStyle="primary" disabled={isFetching}>Save</Button>
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
    signUp,
  }, dispatch),
)(SignUp);


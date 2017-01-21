import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Alert from 'react-bootstrap/lib/Alert';
import Helmet from '../../components/Helmet';
import Loading from '../../components/Loading';
import { Form, Input } from '../../components/forms';
import { signIn } from '../../state/actions/user';

class SignIn extends Component {
  static propTypes = {
    model: PropTypes.shape({
      isFetching: PropTypes.bool,
      error: PropTypes.shape({}),
      info: PropTypes.shape({}),
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

    this.state = {
      validationErrors: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidationError = this.handleValidationError.bind(this);
  }

  getValidationState(prop) {
    return this.state.validationErrors[prop] ? 'error' : null;
  }

  getValidationMessage(prop) {
    return <HelpBlock>{this.state.validationErrors[prop]}</HelpBlock>;
  }

  handleSubmit(values) {
    if (this.props.model.isFetching) return;

    this.props.signIn(values)
      .then(() => window.location.replace(this.props.location.query.next || '/'));
  }

  handleValidationError(validationErrors) {
    this.setState({ validationErrors });
  }

  render() {
    const { isFetching, error } = this.props.model;

    return (
      <div>
        <Helmet title="Sign In" />

        <PageHeader>Sign In</PageHeader>

        <Loading isFetching={isFetching} error={error} renderError={SignIn.renderError} />

        <Form
          ref={c => (this.form = c)}
          constraints={this.constraints}
          onSubmit={this.handleSubmit}
          onValidationError={this.handleValidationError}
        >
          <FormGroup validationState={this.getValidationState('email')}>
            <ControlLabel>Email</ControlLabel>
            <Input
              type="text"
              name="email"
              placeholder="Email"
            />
            {this.getValidationMessage('email')}
          </FormGroup>
          <FormGroup validationState={this.getValidationState('password')}>
            <ControlLabel>Password</ControlLabel>
            <Input
              type="password"
              name="password"
              placeholder="Passowrd"
            />
            {this.getValidationMessage('password')}
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

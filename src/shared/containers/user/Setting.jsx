import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Helmet from '../../components/Helmet';
import Loading from '../../components/Loading';
import { Form, Input } from '../../components/forms';
import { fetchSignedInfo, updateSignedInfo } from '../../state/actions/user';

class Setting extends Component {
  static propTypes = {
    model: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      error: PropTypes.shape({}),
      signedInfo: PropTypes.shape({}),
    }).isRequired,
    updateSignedInfo: PropTypes.func.isRequired,
  };

  static fetchData({ dispatch }) {
    return dispatch(fetchSignedInfo());
  }

  constructor(props) {
    super(props);

    this.constraints = {
      name: { presence: { message: 'Required' } },
      password: (val) => {
        if (!val) {
          return null;
        }
        return {
          length: {
            minimum: 6,
            message: 'Input least 6 characters',
          },
        };
      },
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
    this.props.updateSignedInfo(values).then(() => {
      const { model } = this.props;
      if (!model.error) {
        this.form.setValues({
          ...model.signedInfo,
          password: '',
        });
      }
    });
  }

  handleValidationError(validationErrors) {
    this.setState({ validationErrors });
  }

  render() {
    const { isFetching, error, signedInfo } = this.props.model;

    return (
      <div>
        <Helmet title="Setting" />

        <PageHeader>Setting</PageHeader>

        <Loading isFetching={isFetching} error={error} />

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
              defaultValue={signedInfo.email}
              maxLength="80"
              placeholder="Email"
            />
            {this.getValidationMessage('email')}
          </FormGroup>
          <FormGroup validationState={this.getValidationState('name')}>
            <ControlLabel>Name</ControlLabel>
            <Input
              type="text"
              name="name"
              defaultValue={signedInfo.name}
              maxLength="100"
              placeholder="Name"
            />
            {this.getValidationMessage('name')}
          </FormGroup>
          <FormGroup validationState={this.getValidationState('password')}>
            <ControlLabel>Password</ControlLabel>
            <Input
              type="password"
              name="password"
              maxLength="100"
              placeholder="Password"
            />
            {this.getValidationMessage('password')}
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
    fetchSignedInfo,
    updateSignedInfo,
  }, dispatch),
)(Setting);

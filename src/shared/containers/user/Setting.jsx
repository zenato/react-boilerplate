import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PageHeader from 'react-bootstrap/lib/PageHeader';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Helmet from '../../components/Helmet';
import Indicator from '../../components/Indicator';
import { Form, Input, FormGroup, FieldError } from '../../components/forms';
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

    this.handleSubmit = this.handleSubmit.bind(this);
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

  render() {
    const { isFetching, error, signedInfo } = this.props.model;
    return (
      <div>
        <Helmet title="Setting" />

        <PageHeader>Setting</PageHeader>

        <Indicator isFetching={isFetching} error={error} />

        <Form
          ref={c => (this.form = c)}
          constraints={this.constraints}
          onSubmit={this.handleSubmit}
        >
          <FormGroup name="email">
            <ControlLabel>Email</ControlLabel>
            <Input type="text" name="email" defaultValue={signedInfo.email} maxLength="80" placeholder="Email" />
            <FieldError name="email" />
          </FormGroup>
          <FormGroup name="name">
            <ControlLabel>Name</ControlLabel>
            <Input type="text" name="name" defaultValue={signedInfo.name} maxLength="100" placeholder="Name" />
            <FieldError name="name" />
          </FormGroup>
          <FormGroup name="password">
            <ControlLabel>Password</ControlLabel>
            <Input type="password" name="password" maxLength="100" placeholder="Password" />
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

export default withRouter(connect(
  state => ({
    model: state.user,
  }),
  dispatch => bindActionCreators({
    fetchSignedInfo,
    updateSignedInfo,
  }, dispatch),
)(Setting));

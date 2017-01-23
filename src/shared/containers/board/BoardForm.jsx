/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_creator"] }] */

import dateFormat from 'dateformat';
import React, { PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import browserHistory from 'react-router/lib/browserHistory';
import Panel from 'react-bootstrap/lib/Panel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import HelpBlock from 'react-bootstrap/lib/HelpBlock';
import Helmet from '../../components/Helmet';
import Indicator from '../../components/Indicator';
import { Form, Input, TextArea } from '../../components/forms';
import { fetchDetail, clearDetail, save, update } from '../../state/actions/board';

class BoardForm extends React.Component {
  static propTypes = {
    params: PropTypes.shape({}).isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({}),
    }).isRequired,
    signedInfo: PropTypes.shape({}).isRequired,
    model: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      error: PropTypes.bool,
      item: PropTypes.shape({
        _id: PropTypes.string,
      }),
    }).isRequired,
    save: PropTypes.func.isRequired,
    update: PropTypes.func.isRequired,
  };

  static fetchData({ dispatch, params }) {
    return (!params.id) ? dispatch(clearDetail()) : dispatch(fetchDetail(params.id));
  }

  constructor(props) {
    super(props);

    this.constraints = {
      title: { presence: { message: 'Required' } },
      content: { presence: { message: 'Required' } },
    };

    this.state = {
      validationErrors: {},
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleValidationError = this.handleValidationError.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  getValidationState(prop) {
    return this.state.validationErrors[prop] ? 'error' : null;
  }

  getValidationMessage(prop) {
    return <HelpBlock>{this.state.validationErrors[prop]}</HelpBlock>;
  }

  handleSubmit(values) {
    const { params, model } = this.props;

    if (!model.isFetching) {
      if (!params.id) {
        this.props.save(values).then(() => {
          if (!this.props.model.error) {
            browserHistory.push({ pathname: `/board/${this.props.model.item._id}` });
          }
        });
      } else {
        this.props.update(params.id, values).then(() => {
          if (!this.props.model.error) {
            browserHistory.push({
              pathname: `/board/${params.id}`,
              query: this.props.location.query,
            });
          }
        });
      }
    }
  }

  handleValidationError(validationErrors) {
    this.setState({ validationErrors });
  }

  handleCancel() {
    const { params, location } = this.props;
    if (params.id) {
      browserHistory.push({ pathname: `/board/${params.id}`, query: location.query });
    } else {
      browserHistory.push({ pathname: '/board', query: location.query });
    }
  }

  render() {
    const { signedInfo } = this.props;
    const { isFetching, error, item } = this.props.model;

    return (
      <div>
        <Helmet />

        <Indicator isFetching={isFetching} error={error} />

        {item && (
          <Form
            constraints={this.constraints}
            onSubmit={this.handleSubmit}
            onValidationError={this.handleValidationError}
          >
            <Panel>
              <FormGroup>
                <ControlLabel>Name</ControlLabel>
                <FormControl.Static>{signedInfo.name}</FormControl.Static>
              </FormGroup>

              <FormGroup validationState={this.getValidationState('title')}>
                <ControlLabel>Title</ControlLabel>
                <Input
                  type="text"
                  name="title"
                  defaultValue={item.title}
                  maxLength="50"
                  placeholder="Title"
                />
                {this.getValidationMessage('title')}
              </FormGroup>

              <FormGroup validationState={this.getValidationState('content')}>
                <ControlLabel>Content</ControlLabel>
                <TextArea
                  name="content"
                  defaultValue={item.content}
                  rows="5"
                  placeholder="Content"
                />
                {this.getValidationMessage('content')}
              </FormGroup>

              {item.updatedAt && (
                <FormGroup>
                  <ControlLabel>Updated</ControlLabel>
                  <FormControl.Static>
                    {dateFormat(item.updatedAt, 'yyyy-mm-dd HH:MM:ss')}
                  </FormControl.Static>
                </FormGroup>
              )}
            </Panel>

            <ButtonToolbar>
              <Button type="submit" bsStyle="primary" disabled={isFetching}>Save</Button>
              <Button onClick={this.handleCancel}>Cancel</Button>
            </ButtonToolbar>
          </Form>
        )}
      </div>
    );
  }
}

export default connect(
  state => ({
    signedInfo: state.user.signedInfo,
    model: state.board.detail,
  }),
  dispatch => bindActionCreators({
    fetchDetail,
    clearDetail,
    save,
    update,
  }, dispatch),
)(BoardForm);

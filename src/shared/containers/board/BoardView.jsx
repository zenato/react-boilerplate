/* eslint no-underscore-dangle: ["error", { "allow": ["_id", "_creator"] }] */

import dateFormat from 'dateformat';
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Panel from 'react-bootstrap/lib/Panel';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup';
import Button from 'react-bootstrap/lib/Button';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Confirm from '../../components/Confirm';
import Helmet from '../../components/Helmet';
import Indicator from '../../components/Indicator';
import { fetchDetail, remove } from '../../state/actions/board';

const toggleConfirmation = isShow => () => ({ showConfirmation: isShow });

class BoardView extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    signedInfo: PropTypes.shape({}),
    model: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      error: PropTypes.shape({}),
      item: PropTypes.shape({}),
    }).isRequired,
    remove: PropTypes.func.isRequired,
  };

  static defaultProps = {
    signedInfo: null,
  };

  static fetchData({ dispatch, match }) {
    return dispatch(fetchDetail(match.params.id));
  }

  state = {
    showConfirmation: false,
  };

  handleList = () => {
    this.props.history.push({
      pathname: '/board',
      search: this.props.location.search,
    });
  };

  handleEdit = () => {
    const { history, match, location } = this.props;
    history.push({
      pathname: `/board/edit/${match.params.id}`,
      search: location.search,
    });
  };

  handleRemove = () => {
    this.props.remove(this.props.match.params.id).then(() => {
      this.props.history.goBack();
    });
    this.handleHideConfirmation();
  };

  handleShowConfirmation = () => {
    this.setState(toggleConfirmation(true));
  };

  handleHideConfirmation = () => {
    this.setState(toggleConfirmation(false));
  };

  render() {
    const { signedInfo } = this.props;
    const { isFetching, error, item } = this.props.model;

    return (
      <div>
        <Indicator isFetching={isFetching} error={error} />

        {item && (
          <div>
            <Panel>
              <Helmet
                title={item.title}
                meta={[
                  { property: 'og:type', content: 'article' },
                  { property: 'og:title', content: item.title },
                  { property: 'og:description', content: item.content },
                ]}
              />

              <FormGroup>
                <ControlLabel>Name111</ControlLabel>
                <FormControl.Static>{item._creator.name}</FormControl.Static>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Title</ControlLabel>
                <FormControl.Static>{item.title}</FormControl.Static>
              </FormGroup>

              <FormGroup>
                <ControlLabel>Content</ControlLabel>
                <FormControl.Static>{item.content}</FormControl.Static>
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
              {signedInfo && signedInfo._id === item._creator._id && (
                <ButtonGroup>
                  <Button onClick={this.handleEdit} bsStyle="primary" disabled={isFetching}>
                    Edit
                  </Button>
                  <Button
                    onClick={this.handleShowConfirmation}
                    disabled={isFetching}
                    bsStyle="danger"
                  >
                    Remove
                  </Button>
                </ButtonGroup>
              )}
              <ButtonGroup>
                <Button onClick={this.handleList} bsStyle="warning">List</Button>
              </ButtonGroup>
            </ButtonToolbar>
          </div>
        )}

        <Confirm
          show={this.state.showConfirmation}
          onHide={this.handleHideConfirmation}
          onSubmit={this.handleRemove}
          message="Do you want delete?"
        />
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({
    signedInfo: state.user.signedInfo,
    model: state.board.detail,
  }),
  dispatch => bindActionCreators({
    fetchDetail,
    remove,
  }, dispatch),
)(BoardView));

/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import qs from 'querystring';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Table from 'react-bootstrap/lib/Table';
import Helmet from '../../components/Helmet';
import Pagination from '../../components/Pagination';
import Indicator from '../../components/Indicator';
import { BoardSearch, BoardListItem } from '../../components/board';
import { fetchList } from '../../state/actions/board';

class BoardList extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string,
    }).isRequired,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    model: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      error: PropTypes.shape({}),
      items: PropTypes.arrayOf(PropTypes.shape({})),
      pagination: PropTypes.shape({}),
    }).isRequired,
    fetchList: PropTypes.func.isRequired,
  };

  static fetchData({ dispatch, location }) {
    const query = qs.parse(location.search.substring(1));
    return dispatch(fetchList(query));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      const query = qs.parse(nextProps.location.search.substring(1));
      this.props.fetchList(query);
    }
  }

  handlePageSelect = (page) => {
    const { location } = this.props;
    this.props.history.push({
      search: qs.stringify({
        ...qs.parse(location.search.substring(1)),
        page,
      }),
    });
  };

  handleSearch = (query) => {
    this.props.history.push({
      search: qs.stringify(query),
    });
  };

  handleInitialize = () => {
    this.props.history.push({
      pathname: this.props.location.pathname,
    });
  };

  handleCreate = () => {
    this.props.history.push({
      pathname: '/board/new',
      search: this.props.location.search,
    });
  };

  handleView = (id) => {
    const location = this.props.location;
    this.props.history.push({
      pathname: `${location.pathname}/${id}`,
      search: location.search,
    });
  };

  render() {
    const { location } = this.props;
    const { isFetching, error, items, pagination } = this.props.model;

    return (
      <div>
        <Helmet title="Board" />

        <BoardSearch
          values={qs.parse(location.search.substring(1))}
          onSubmit={this.handleSearch}
          onReset={this.handleInitialize}
          onCreate={this.handleCreate}
        />

        <Indicator isFetching={isFetching} error={error} />

        {items && (
          <div>
            <div>Total: {pagination && pagination.total}</div>
            <Table responsive bordered hover striped>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Name</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {!items.length && (
                  <tr>
                    <td colSpan="4" className="text-center">Couldn&apos;t find anything.</td>
                  </tr>
                )}

                {items.map((item, index) => (
                  <BoardListItem
                    index={pagination.index - index}
                    key={item._id}
                    item={item}
                    onClick={this.handleView}
                  />
                ))}
              </tbody>
            </Table>
            <Pagination {...pagination} onSelect={this.handlePageSelect} />
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(connect(
  state => ({ model: state.board.list }),
  dispatch => bindActionCreators({ fetchList }, dispatch),
)(BoardList));

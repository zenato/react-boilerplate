/* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import browserHistory from 'react-router/lib/browserHistory';
import Table from 'react-bootstrap/lib/Table';
import Helmet from '../../components/Helmet';
import Pagination from '../../components/Pagination';
import Indicator from '../../components/Indicator';
import { BoardSearch, BoardListItem } from '../../components/board';
import { fetchList } from '../../state/actions/board';
import { isChangedLocation } from '../../lib/router';

class BoardList extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    model: PropTypes.shape({
      isFetching: PropTypes.bool.isRequired,
      error: PropTypes.shape({}),
      items: PropTypes.arrayOf(PropTypes.shape({})),
      pagination: PropTypes.shape({}),
    }).isRequired,
    reload: PropTypes.func.isRequired,
  };

  static fetchData({ dispatch, location }) {
    return dispatch(fetchList(location.query));
  }

  constructor(props) {
    super(props);

    this.handleSearch = this.handleSearch.bind(this);
    this.handleInitialize = this.handleInitialize.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.handlePageSelect = this.handlePageSelect.bind(this);
    this.handleView = this.handleView.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (isChangedLocation(this.props.location, nextProps.location)) {
      this.props.reload();
    }
  }

  handlePageSelect(page) {
    const { location } = this.props;
    browserHistory.push({
      pathname: location.pathname,
      query: { ...location.query, page },
    });
  }

  handleSearch(query) {
    browserHistory.push({ pathname: this.props.location.pathname, query });
  }

  handleInitialize() {
    browserHistory.push({ pathname: this.props.location.pathname });
  }

  handleCreate() {
    const { location: { query } } = this.props;
    browserHistory.push({ pathname: '/board/new', query });
  }

  handleView(id) {
    const location = this.props.location;
    browserHistory.push({ pathname: `${location.pathname}/${id}`, query: location.query });
  }

  render() {
    const { location } = this.props;
    const { isFetching, error, items, pagination } = this.props.model;

    return (
      <div>
        <Helmet title="Board" />

        <BoardSearch
          values={location.query}
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

export default connect(
  state => ({ model: state.board.list }),
)(BoardList);


import { combineReducers } from 'redux';
import isUndefined from 'lodash/isUndefined';
import {
  BOARD_LIST_REQUEST,
  BOARD_LIST_SUCCESS,
  BOARD_LIST_FAILURE,
  BOARD_DETAIL_REQUEST,
  BOARD_DETAIL_SUCCESS,
  BOARD_DETAIL_FAILURE,
} from '../actionTypes';

const initList = {
  error: null,
  items: null,
  pagination: null,
  isFetching: false,
};

function list(state = initList, action) {
  const { type, error, items, pagination } = action;
  switch (type) {
    case BOARD_LIST_REQUEST:
    case BOARD_LIST_SUCCESS:
    case BOARD_LIST_FAILURE:
      return {
        ...state,
        error,
        items,
        pagination,
        isFetching: type === BOARD_LIST_REQUEST,
      };
    default:
      return state;
  }
}

const initDetail = {
  error: null,
  item: null,
  isFetching: false,
};

function detail(state = initDetail, action) {
  const { type, error, item } = action;
  switch (type) {
    case BOARD_DETAIL_REQUEST:
    case BOARD_DETAIL_SUCCESS:
    case BOARD_DETAIL_FAILURE:
      return {
        ...state,
        error,
        item: isUndefined(item) ? state.item : item,
        isFetching: type === BOARD_DETAIL_REQUEST,
      };
    default:
      return state;
  }
}

export default combineReducers({
  list,
  detail,
});

import axios from 'axios';
import { authConfig, formatError } from '../../lib/request';
import {
  BOARD_LIST_REQUEST,
  BOARD_LIST_SUCCESS,
  BOARD_LIST_FAILURE,
  BOARD_DETAIL_REQUEST,
  BOARD_DETAIL_SUCCESS,
  BOARD_DETAIL_FAILURE,
} from '../actionTypes';

const BOARD_API = `${process.env.API_URL}/board`;

const fetchList = filters => async (dispatch) => {
  dispatch({ type: BOARD_LIST_REQUEST });
  try {
    const { data } = await axios.get(BOARD_API, { params: filters });
    dispatch({
      type: BOARD_LIST_SUCCESS,
      items: data.items,
      pagination: data.pagination,
    });
  } catch (e) {
    dispatch({ type: BOARD_LIST_FAILURE, error: formatError(e) });
  }
};

const fetchDetail = id => async (dispatch) => {
  dispatch({ type: BOARD_DETAIL_REQUEST, item: null });
  try {
    const { data } = await axios.get(`${BOARD_API}/${id}`);
    dispatch({ type: BOARD_DETAIL_SUCCESS, item: data });
  } catch (e) {
    dispatch({ type: BOARD_DETAIL_FAILURE, error: formatError(e) });
  }
};

const clearDetail = () => ({ type: BOARD_DETAIL_SUCCESS, item: {} });

const save = item => async (dispatch, getState) => {
  dispatch({ type: BOARD_DETAIL_REQUEST });
  try {
    const { accessToken } = getState();
    const { data } = await axios.post(`${BOARD_API}/save`, item, authConfig(accessToken));
    dispatch({ type: BOARD_DETAIL_SUCCESS, item: data });
  } catch (e) {
    dispatch({ type: BOARD_DETAIL_FAILURE, error: formatError(e) });
  }
};

const update = (id, item) => async (dispatch, getState) => {
  dispatch({ type: BOARD_DETAIL_REQUEST });
  try {
    const { accessToken } = getState();
    const { data } = await axios.put(`${BOARD_API}/${id}`, item, authConfig(accessToken));
    dispatch({ type: BOARD_DETAIL_SUCCESS, item: data });
  } catch (e) {
    dispatch({ type: BOARD_DETAIL_FAILURE, error: formatError(e) });
  }
};

const remove = id => async (dispatch, getState) => {
  dispatch({ type: BOARD_DETAIL_REQUEST });
  try {
    const { accessToken } = getState();
    await axios.delete(`${BOARD_API}/${id}`, authConfig(accessToken));
    dispatch({ type: BOARD_DETAIL_SUCCESS });
  } catch (e) {
    dispatch({ type: BOARD_DETAIL_FAILURE, error: formatError(e) });
  }
};

export {
  fetchList,
  fetchDetail,
  clearDetail,
  save,
  update,
  remove,
};

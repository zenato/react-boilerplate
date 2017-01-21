import axios from 'axios';
import cookies from 'cookies-js';
import { authConfig, formatError } from '../../lib/request';
import {
  ACCESS_TOKEN,
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE,
} from '../actionTypes';

const USER_API = `${process.env.API_URL}/user`;

const signIn = form => async (dispatch) => {
  dispatch({ type: USER_REQUEST });
  try {
    const { data: { accessToken } } = await axios.post(`${USER_API}/login`, form);
    const { data } = await axios.get(`${USER_API}/me`, authConfig(accessToken));

    dispatch({ type: ACCESS_TOKEN, accessToken });
    dispatch({ type: USER_SUCCESS, signedInfo: data });

    cookies.set('accessToken', accessToken);
  } catch (e) {
    dispatch({ type: USER_FAILURE, error: formatError(e) });
  }
};

const signUp = form => async (dispatch) => {
  dispatch({ type: USER_REQUEST });
  try {
    await axios.post(`${USER_API}/join`, form);
    dispatch({ type: USER_SUCCESS });
  } catch (e) {
    dispatch({ type: USER_FAILURE, error: formatError(e) });
  }
};

const fetchSignedInfo = silent => async (dispatch, getState) => {
  dispatch({ type: USER_REQUEST });
  try {
    const { accessToken } = getState();
    const { data } = await axios.get(`${USER_API}/me`, authConfig(accessToken));
    dispatch({ type: USER_SUCCESS, signedInfo: data });
  } catch (e) {
    if (silent) {
      dispatch({ type: USER_SUCCESS, signedInfo: null });
    } else {
      dispatch({ type: USER_FAILURE, error: formatError(e) });
    }
  }
};

const updateSignedInfo = user => async (dispatch, getState) => {
  dispatch({ type: USER_REQUEST });
  try {
    const { accessToken } = getState();
    const { data } = await axios.put(`${USER_API}/me`, user, authConfig(accessToken));
    dispatch({ type: USER_SUCCESS, signedInfo: data });
  } catch (e) {
    dispatch({ type: USER_FAILURE, error: formatError(e) });
  }
};

export {
  signIn,
  signUp,
  fetchSignedInfo,
  updateSignedInfo,
};

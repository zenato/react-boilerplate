import isUndefined from 'lodash/isUndefined';
import {
  USER_REQUEST,
  USER_SUCCESS,
  USER_FAILURE,
} from '../actionTypes';

const initState = {
  error: null,
  isFetching: false,
  signedInfo: null,
};

export default function (state = initState, action) {
  const { type, error, signedInfo } = action;
  switch (type) {
    case USER_REQUEST:
    case USER_SUCCESS:
    case USER_FAILURE:
      return {
        ...state,
        error,
        isFetching: type === USER_REQUEST,
        signedInfo: isUndefined(signedInfo) ? state.signedInfo : signedInfo,
      };
    default:
      return state;
  }
}

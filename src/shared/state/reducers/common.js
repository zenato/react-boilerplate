import {
  ACCESS_TOKEN,
  REQUEST,
  SUCCESS,
  FAILURE,
} from '../actionTypes';

function accessToken(state = '', action) {
  switch (action.type) {
    case ACCESS_TOKEN:
      return action.accessToken;
    default:
      return state;
  }
}

function isFetching(state = false, action) {
  switch (action.type) {
    case REQUEST:
    case SUCCESS:
    case FAILURE:
      return action.type === REQUEST;
    default:
      return state;
  }
}

function error(state = null, action) {
  switch (action.type) {
    case REQUEST:
    case SUCCESS:
    case FAILURE:
      return action.type === FAILURE ? action.error : null;
    default:
      return state;
  }
}

export default {
  accessToken,
  isFetching,
  error,
};

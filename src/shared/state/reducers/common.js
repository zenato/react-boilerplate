import {
  ACCESS_TOKEN,
  REQUEST,
  DONE,
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
    case DONE:
      return action.type === REQUEST;
    default:
      return state;
  }
}

function error(state = null, action) {
  if (action.type === REQUEST) {
    return null;
  }
  if (action.error) {
    return action.error;
  }
  return state;
}

export default {
  accessToken,
  isFetching,
  error,
};

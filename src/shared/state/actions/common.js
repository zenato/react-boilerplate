import { REQUEST, DONE, ACCESS_TOKEN } from '../actionTypes';

const request = () => ({ type: REQUEST });
const done = () => ({ type: DONE });

const saveAccessToken = accessToken => ({ type: ACCESS_TOKEN, accessToken });

export {
  request,
  done,
  saveAccessToken,
};

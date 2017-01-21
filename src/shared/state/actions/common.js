import { formatError } from '../../lib/request';
import { REQUEST, SUCCESS, FAILURE, ACCESS_TOKEN } from '../actionTypes';

const request = () => ({ type: REQUEST });
const success = () => ({ type: SUCCESS });
const failure = e => ({ type: FAILURE, error: formatError(e) });

const saveAccessToken = accessToken => ({ type: ACCESS_TOKEN, accessToken });

export {
  request,
  success,
  failure,
  saveAccessToken,
};

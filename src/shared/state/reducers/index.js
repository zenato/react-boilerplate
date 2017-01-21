import { combineReducers } from 'redux';
import common from './common';
import board from './board';
import user from './user';

export default combineReducers({
  ...common,
  board,
  user,
});

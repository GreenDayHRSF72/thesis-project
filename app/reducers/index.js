import { combineReducers } from 'redux';
import * as counterReducer from './counter';
import * as userReducer from './user';
import * as eventReducer from './event';
import * as testReducer from './testData';
import * as suggestionReducer from './suggestion';

export default combineReducers(Object.assign(
  counterReducer,
  userReducer,
  eventReducer,
  testReducer,
  suggestionReducer,
));

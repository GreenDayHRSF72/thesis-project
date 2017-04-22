import { combineReducers } from 'redux';
import * as counterReducer from './counter';
import * as userReducer from './user';
import * as eventReducer from './event';
import * as suggestionReducer from './suggestion';
import * as activeEventReducer from './activeEvent';

export default combineReducers(Object.assign(
  counterReducer,
  userReducer,
  eventReducer,
  suggestionReducer,
  activeEventReducer,
));

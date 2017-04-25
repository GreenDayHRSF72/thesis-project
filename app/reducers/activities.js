import * as types from '../actions/types';

export const activities = function(state = [], action) {
  switch (action.type) {
    case 'GET_ACTIVITIES':
      return action.payload;
    default:
      return state;
  }
};
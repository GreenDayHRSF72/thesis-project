import * as types from '../actions/types';

export const yelpResults = function (state = [], action) {
  switch (action.type) {
    case 'GET_YELP':
      return action.payload;
    default:
      return state;
  }
};

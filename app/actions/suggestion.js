import * as types from './types';

export function getYelp(payload) { 
  return {
    type: types.GET_YELP,
    payload,
  };
}
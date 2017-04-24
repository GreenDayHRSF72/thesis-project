import * as types from './types';

export function getActivites(payload) {
  return {
    type: types.GET_ACTIVITIES,
    payload,
  };
}

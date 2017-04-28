import * as types from './types';

export function getActivities(payload) {
  return {
    type: types.GET_ACTIVITIES,
    payload,
  };
}
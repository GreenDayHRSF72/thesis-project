import * as types from './types';

export function getUserProfile(payload) {
  return {
    type: types.GET_USER_PROFILE,
    payload,
  };
}

export function saveUserId(id) {
  return {
    type: types.SAVE_USER_ID,
    id,
  };
}

export function clearUser() {
  return {
    type: types.CLEAR_USER,
  };
}


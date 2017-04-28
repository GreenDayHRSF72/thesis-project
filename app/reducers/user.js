import * as types from '../actions/types';

export const user = function (state = {}, action) {
  switch (action.type) {
    case 'GET_USER_PROFILE':
      return action.payload;
    case 'SAVE_USER_ID':
      return Object.assign({}, state, {
        id: action.id,
      });
    case 'CLEAR_USER':
      return {};
    default:
      return state;
  }
};

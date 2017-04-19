import * as types from '../actions/types';

const initalState = {
  location: '',
  date: null,
  startTime: null,
  endTime: null,
  name: '',
  description: '',
};

export const event = function(state = initalState, action) {
  switch (action.type) {
    case 'SAVE_EVENT':
      return action.payload;
    case 'SAVE_START_TIME':
      return Object.assign({}, state, {
        startTime: action.time,
      });
    case 'SAVE_END_TIME':
      return Object.assign({}, state, {
        endTime: action.time,
      });
    case 'SAVE_DATE':
      return Object.assign({}, state, {
        date: action.date,
      });
    case 'SUG_EVENT':
      return Object.assign({}, state, {
        location: action.payload.location,
        name: action.payload.name,
        description: action.payload.description,
      });
    case 'CHANGE_NAM':
      return Object.assign({}, state, {
        name: action.payload,
      });
    case 'CHANGE_LOC':
      return Object.assign({}, state, {
        location: action.payload,
      });
    case 'CHANGE_DES':
      return Object.assign({}, state, {
        description: action.payload,
      });
    default:
      return state;
  }
};

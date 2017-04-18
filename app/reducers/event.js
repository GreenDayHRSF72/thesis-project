import * as types from '../actions/types';

const initalState = {
  location: '',
  date: null,
  startTime: null,
  endTime: null,
}

export const event = function (state = initalState, action) {
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
      return Object.Assign({}, state, {
        location: action.payload.location,
      })
    default:
      return state;
  }
};

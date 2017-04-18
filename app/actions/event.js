import * as types from './types';

export function saveEvent(payload) {
  return {
    type: types.SAVE_EVENT,
    payload,
  };
}

export function saveDate(date) {
  return {
    type: types.SAVE_DATE,
    date,
  };
}

export function saveStartTime(time) {
  return {
    type: types.SAVE_START_TIME,
    time,
  };
}

export function saveEndTime(time) {
  return {
    type: types.SAVE_END_TIME,
    time,
  };
}

export function suggestEvent (payload) {
  return {
    type: types.SUG_EVENT,
    payload,
  }
}

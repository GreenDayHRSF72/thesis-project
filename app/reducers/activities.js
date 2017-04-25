import * as types from '../actions/types';

let initialState = [
	{name: 'name is name', location: 'location asdf'},
	{name: 'i am not martin', location: 'unknowndf'},
	{name: 'tyrone', location: 'I am not quite suredf'},
]

export const activities = function(state = initialState, action) {
  switch (action.type) {
    case 'GET_ACTIVITIES':
      return action.payload;
    default:
      return state;
  }
};
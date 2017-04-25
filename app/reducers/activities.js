import * as types from '../actions/types';

let initialState = [
	{name: 'name is name', location: 'location asdf', id: 1, votes: 0},
	{name: 'i am not martin', location: 'unknowndf', id: 2, votes: 0},
	{name: 'tyrone', location: 'I am not quite suredf', id: 3, votes: 0},
]

export const activities = function(state = initialState, action) {
  switch (action.type) {
    case 'GET_ACTIVITIES':
      return action.payload;
    default:
      return state;
  }
};
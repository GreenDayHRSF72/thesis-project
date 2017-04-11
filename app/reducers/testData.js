import * as types from '../actions/testData';


export const testResults = function(state = [{id: 0, value: 'WUT IS THIS VALUE'}], action) {
	switch (action.type) {
		case 'GET_TEST_DATA':
			return action.payload;
		default:
			return state; 
	}
  // switch(action.type) {
  //   case 'ADD_COUNT':
  //     return state + 1;
  //   default: 
  //     return state;
  // }
};

export const locationResults = function(state = {latitude: null, longitude: null}, action) {
	switch (action.type) {
		case 'GET_LOCATION': 
			return action.payload;
		default:
			return state;
	}
}


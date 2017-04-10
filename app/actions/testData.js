import * as types from './types';

export function getTestData(payload) {
  return {
    type: types.GET_TEST_DATA,
    payload,
  };
}

export function getGeolocation(payload){
	return {
		type: types.GET_LOCATION,
		payload, 
	}
}

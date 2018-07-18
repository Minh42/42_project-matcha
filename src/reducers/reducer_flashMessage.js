import { ADD_FLASH_MESSAGE, DELETE_FLASH_MESSAGE  } from '../actions/actionMessages';

const initialState = {  
	message: null,
	style: null
  }

export default function (state = initialState, action = {}) {
	switch(action.type) {
		case ADD_FLASH_MESSAGE:
			return action.payload;
		default:
			return state;
	}
}
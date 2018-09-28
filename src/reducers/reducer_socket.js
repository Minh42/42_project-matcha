import { SOCKET_ON } from '../actions/actionSocket';

export default function (state = null, action) {
	switch(action.type) {
		case SOCKET_ON:
        return {
			...state,
            socket: action.payload
		};
		default:
		  return state;
	}
}

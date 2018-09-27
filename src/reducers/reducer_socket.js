import { SOCKET_ON } from '../actions/actionSocket';

export default function (state = null, action) {
	switch(action.type) {
		case 'REHYDRATE':
		return {...state, socket: action.payload.socket
	  };
		case SOCKET_ON:
        return {
			...state,
            socket: action.payload
		};
		default:
		  return state;
	}
}

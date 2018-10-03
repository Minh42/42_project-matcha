import * as config from '../constants/websockets';
import { SHOW_CONVERSATION  } from '../actions/actionConversations';
const { messageTypes } = config;

export default function (state = null, action) {
	switch(action.type) {
		case messageTypes.userJoined:
			return {
				...state,
				socketID: action.payload.socketID,
				connectedUsers: action.payload.users
			};
		case messageTypes.userLeft:
			return {
				...state,
				connectedUsers: action.payload.users
			}
		case messageTypes.showNotification:
			return {
				...state,
				message: action.payload.message
			}
		case SHOW_CONVERSATION:
			return {
				...state,
				conversation: action.payload
			}
		default:
		  return state;
	}
}
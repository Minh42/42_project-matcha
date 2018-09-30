import * as config from '../constants/websockets';
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
		default:
		  return state;
	}
}

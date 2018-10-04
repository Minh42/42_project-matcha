import * as config from '../constants/websockets';
const { messageTypes } = config;

export default function (state = null, action) {
	switch(action.type) {
		case messageTypes.sendMessages:
			return {
				...state,
				conversations: action.payload
			};
		case messageTypes.sendConversations:
			return {
				...state,
				conversations_list: action.payload
			};
		case messageTypes.showDirectMessage:
			return {
				...state,
				conversations: action.payload
			};
		default:
		  return state;
	}
}
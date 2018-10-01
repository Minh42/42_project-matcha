import * as config from '../constants/websockets';
const { messageTypes } = config;

export default function (state = null, action) {
	switch(action.type) {
		case messageTypes.sendMessages:
			return {
				...state,
				conversations: action.payload
			};
		default:
		  return state;
	}
}
import { PROFILE_CONVERSATION } from '../actions/actionConversation';

export default function (state = null, action) {
	switch(action.type) {
		case PROFILE_CONVERSATION:
        return {
			...state,
            profileConversation: action.payload
		};
		default:
		  return state;
	}
}

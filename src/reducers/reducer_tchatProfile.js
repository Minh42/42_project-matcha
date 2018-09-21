import { PROFILE_TCHAT_ID } from '../actions/actionOpenTchat';

export default function (state = null, action) {
	switch(action.type) {
		case PROFILE_TCHAT_ID:
        return {
			...state,
            profileTchatID: action.payload
		};
		default:
		  return state;
	}
}
import { PROFILE_LIKES } from '../actions/actionMatch';

export default function (state = null, action) {
	switch(action.type) {
		case PROFILE_LIKES:
        return {
			...state,
            profileLikes: action.payload
		};
		default:
		  return state;
	}
}

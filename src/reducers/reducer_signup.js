import { REGISTERATION_SUCCESS, REGISTERATION_ERROR, REGISTERATION_FAILED } from '../actions/actionUsers';

export default function (state = {}, action) {
    switch (action.type) {
        case REGISTERATION_SUCCESS :
            return {...state, registered: true };
        case REGISTERATION_FAILED :
            return {...state, registered : false };
        case REGISTERATION_ERROR :
            return {...state, error: action.payload};
    default:
        return state;
    }
}

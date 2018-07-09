import { SIGNUP_ACTION } from '../actions/index';

export default function (state = {}, action) {
    switch (action.type) {
        case SIGNUP_ACTION:
            return (action.payload.data);
    default:
        return state;
    }
}
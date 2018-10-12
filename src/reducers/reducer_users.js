import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE, FETCH_USERS_CANCEL, FETCH_USERS_RESET } from '../actions/actionFetch';
import shortid from 'shortid';

const initialState = {
    items: [],
    loading: false,
    error: null
  };

export default function (state = initialState, action) {
    switch(action.type) {
        case FETCH_USERS_REQUEST:
        return {
            ...state,
            loading: true,
            error: null
        };
        case FETCH_USERS_SUCCESS: 
        return {
            ...state,
            id: shortid.generate(),
            loading: false,
            items: state.items.concat(action.payload)
        }
        case FETCH_USERS_FAILURE:
        return {
            ...state,
            loading: false,
            error: action.payload,
            items: []
        }
        case FETCH_USERS_CANCEL:
        return {
            ...state,
            loading: false,
            cancelFetch: action.payload
        }
        case FETCH_USERS_RESET:
            return initialState
        default:
        return state;
    }
}
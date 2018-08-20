import { FETCH_USERS_REQUEST, FETCH_USERS_SUCCESS, FETCH_USERS_FAILURE } from '../actions/actionFetch';
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
            items: action.payload
        }
        case FETCH_USERS_FAILURE:
        return {
            ...state,
            loading: false,
            error: action.payload,
            items: []
        }
        default:
        return state;
    }
}
import { FETCH_CURRENT_USER, AUTHENTICATED, UNAUTHENTICATED, AUTHENTICATION_ERROR } from '../actions/actionUsers';

export default function(state = null, action) {
  switch(action.type) {
    case AUTHENTICATED:
      return { ...state, authenticated: true };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}
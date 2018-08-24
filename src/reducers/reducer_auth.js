import { FETCH_CURRENT_USER, AUTHENTICATED, UNAUTHENTICATED, AUTHENTICATION_ERROR, ONBOARDING, UNONBOARDING } from '../actions/actionUsers';

export default function(state = null, action) {
  switch(action.type) {
    case AUTHENTICATED:
      return { ...state, authenticated: true, currentUser: action.payload };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false };
    case AUTHENTICATION_ERROR:
      return { ...state, error: action.payload };
    case ONBOARDING:
      return { ...state, onboarding: true };
    case UNONBOARDING:
      return { ...state, onboarding: false };  
    default:
      return state;
  }
}
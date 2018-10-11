import { AUTHENTICATED, UNAUTHENTICATED, AUTHENTICATION_ERROR, ONBOARDING, UNONBOARDING } from '../actions/actionUsers';

const INITIAL_STATE = {
  currentUser: null,
  authenticated: false
};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case 'REHYDRATE':
      return {...state, currentUser: action.payload.currentUser
    };
    case AUTHENTICATED:
      return { ...state, authenticated: true, currentUser: action.payload };
    case UNAUTHENTICATED:
      return { ...state, authenticated: false, currentUser: action.payload };
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
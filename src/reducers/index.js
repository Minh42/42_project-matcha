import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './reducer_auth';
import signUpReducer from './reducer_signup';

// mapping of our state
const rootReducer = combineReducers({
    signup: signUpReducer,
    auth: authReducer,
    form: formReducer
});

export default rootReducer;
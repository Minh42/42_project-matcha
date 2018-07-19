import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './reducer_auth';
import signUpReducer from './reducer_signup';
import flashMessagesReducer from './reducer_flashMessages';

// mapping of our state
const rootReducer = combineReducers({
    signup: signUpReducer,
    auth: authReducer,
    form: formReducer,
    flashMessages: flashMessagesReducer
});

export default rootReducer;
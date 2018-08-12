import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './reducer_auth';
import signUpReducer from './reducer_signup';
import flashMessagesReducer from './reducer_flashMessages';
import usersReducer from './reducer_users';
import selectedUser from './reducer_selectedUser';
import { UNAUTHENTICATED } from '../actions/actionUsers';

// mapping of our state
const appReducer = combineReducers({
    signup: signUpReducer,
    auth: authReducer,
    form: formReducer,
    flashMessages: flashMessagesReducer,
    users: usersReducer,
    selectedUser: selectedUser
});

const rootReducer = (state, action) => {
    if (action.type === UNAUTHENTICATED) {
        state = undefined;
    }
    return appReducer(state, action)
}

export default rootReducer;
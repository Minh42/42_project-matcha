import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './reducer_auth';
import signUpReducer from './reducer_signup';
import flashMessagesReducer from './reducer_flashMessages';
import usersReducer from './reducer_users';
import selectedUserReducer from './reducer_selectedUser';
import filterUsersReducer from './reducer_filter';
import socketReducer from './reducer_socket';
import messagesReducer from './reducer_messages';
import { UNAUTHENTICATED } from '../actions/actionUsers';

// mapping of our state
const appReducer = combineReducers({
    signup: signUpReducer,
    auth: authReducer,
    form: formReducer,
    flashMessages: flashMessagesReducer,
    users: usersReducer,
    selectedUser: selectedUserReducer,
    filterUsers: filterUsersReducer,
    conversations: messagesReducer,
    socket : socketReducer
});

const rootReducer = (state, action) => {
    if (action.type === UNAUTHENTICATED) {
        state = undefined;
    }
    return appReducer(state, action)
}

export default rootReducer;
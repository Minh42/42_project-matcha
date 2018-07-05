import { combineReducers } from 'redux';
import UsersReducer from './reducer_users';

// mapping of our state
const rootReducer = combineReducers({
    users: UsersReducer
});

export default rootReducer;
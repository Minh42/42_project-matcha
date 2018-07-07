import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
// import UsersReducer from './reducer_users';

// mapping of our state
const rootReducer = combineReducers({
    // users: UsersReducer
    form: formReducer
});

export default rootReducer;
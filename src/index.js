require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import App from './App';
 
import rootReducer from './reducers';
import { loadState, saveState } from '../library/localStorage';
import throttle from 'lodash/throttle';

const persistedState = loadState();
const store = createStore(
    rootReducer,
    persistedState,
    compose(
        applyMiddleware(reduxThunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f // initialize devToolsExtension
    )
)

// persist auth state on refresh
store.subscribe(throttle(() => {
    saveState({
        auth: store.getState().auth
    });
}, 1000));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
   , document.querySelector('.root'));


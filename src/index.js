require("../public/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import throttle from 'lodash/throttle';
import { saveState } from '../library/localStorage';
import configureStore from './store/configureStore';

const store = configureStore();

// persist state on refresh
store.subscribe(throttle(() => {
    saveState({
        auth: store.getState().auth,
        selectedUser: store.getState().selectedUser,
        users: store.getState().users
    });
}, 1000));

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
   , document.querySelector('.root'));

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./App', function () {
        var NextApp = require('./App').default
        ReactDOM.render(
        <Provider store={store}>
            <NextApp />
        </Provider>
       , document.querySelector('.root'));
    })
}
  
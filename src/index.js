require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router>
            <Route exact path="/" component={App} />
            {/* <Route path="/signin" component={Signin} />
            <Route path="/homepage" component={Homepage} /> */}
        </Router>
    </Provider>
   , document.querySelector('.root'));


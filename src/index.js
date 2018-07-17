require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import LoginContainer from './containers/LoginContainer';
import reducers from './reducers';
import setAuthorizationToken from "../library/setAuthorizationToken";
// import Redirect from "react-router-dom/Redirect";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

setAuthorizationToken(localStorage.jwtToken);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router>
            <Switch>
                <Route exact path="/" component={App} />
                {/* <Route path="/success" component={App} /> */}
                {/* <Route path="/signin" component={Signin} /> */}
                {/* <Route path="/homepage" component={Footer} /> */}
            </Switch>
        </Router>
    </Provider>
   , document.querySelector('.root'));


require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import Header from './layout/Header';
import Home from './layout/Home';
import Footer from './layout/Footer';
import LoginContainer from './containers/LoginContainer';

import reducers from './reducers';
import setAuthorizationToken from "../library/setAuthorizationToken";

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);

setAuthorizationToken(localStorage.jwtToken);

ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
        <Router>
            <div>
                <Header />
                <Switch>
                    <Route exact path="/" component={Home} />
                    {/* <Route path="/homepage" component={Footer} /> */}
                    {/* <Route path="/redirectMail" component={RedirectMail} /> */}
                </Switch>
                <Footer />
            </div>
        </Router>
    </Provider>
   , document.querySelector('.root'));


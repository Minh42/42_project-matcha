require("../assets/stylesheets/styles.scss");

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';

import Header from './layout/Header';
import Footer from './layout/Footer';
import LandingPage from './layout/LandingPage';
import ForgotPassword from './containers/ForgotPasswordContainer';
import HomePage from './layout/HomePage';
import MessagesPage from './layout/MessagesPage';
 
import rootReducer from './reducers';
import setAuthorizationToken from '../library/setAuthorizationToken';
import requireAuth from '../library/requireAuth';

const store = createStore(
    rootReducer,
    compose(
        applyMiddleware(reduxThunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f // initialize devToolsExtension
    )
)

setAuthorizationToken(localStorage.jwtToken);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Header />
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/homepage" component={requireAuth(HomePage)} />
                    <Route path="/messages" component={requireAuth(MessagesPage)} />
                    <Route path="/forgotPassword" component={ForgotPassword} />
                </Switch>
                <Footer />
            </div>
        </Router>
    </Provider>
   , document.querySelector('.root'));


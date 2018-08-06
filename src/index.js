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
import HomePage from './layout/HomePage';
import MessagesPage from './layout/MessagesPage';
import ForgotPassword from './containers/ForgotPasswordContainer';
import ResetPassword from './containers/ResetPasswordContainer';
import PublicProfile from './layout/ProfileUser';
import ModifProfile from './layout/ModifProfile';
import Onboarding from './components/Onboarding/wizardForm';
 
import rootReducer from './reducers';
import setAuthorizationToken from '../library/setAuthorizationToken';
import requireAuth from '../library/requireAuth';
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

store.subscribe(throttle(() => {
    saveState({
        auth: store.getState().auth
    });
}, 1000));

setAuthorizationToken(localStorage.jwtToken);

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <div>
                <Header />
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/homepage" component={HomePage} />
                    <Route path="/messages" component={requireAuth(MessagesPage)} />
                    <Route path="/forgotPassword" component={ForgotPassword} />
                    <Route path="/resetPassword/:id" component={ResetPassword} />
                    <Route path="/profile" component={PublicProfile} />
                    <Route path="/ModifProfile" component={ModifProfile} />
                    <Route path="/Onboarding/:id" component={Onboarding} />
                </Switch>
                <Footer />
            </div>
        </Router>
    </Provider>
   , document.querySelector('.root'));


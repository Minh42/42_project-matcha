import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchCurrentUser } from './actions/actionUsers';
import { bindActionCreators } from 'redux';
import requireAuth from '../library/requireAuth';
import setAuthorizationToken from '../library/setAuthorizationToken';

import Header from './layout/Header';
import Footer from './layout/Footer';
import LandingPage from './layout/LandingPage';
import HomePage from './layout/HomePage';
import MessagesPage from './layout/MessagesPage';
import ForgotPassword from './containers/ForgotPasswordContainer';
import ResetPassword from './containers/ResetPasswordContainer';
import UserProfile from './layout/UserProfile';
import ModifProfile from './layout/ModifProfile';
import Onboarding from './components/Onboarding/wizardForm';

setAuthorizationToken(localStorage.jwtToken);

class App extends Component {

    componentDidMount() {
        this.props.fetchCurrentUser();
    }

    render() {
        return (
            <Router>
                <div>
                    <Header />
                    <Switch>
                        <Route exact path="/" component={LandingPage} />
                        <Route path="/homepage" component={requireAuth(HomePage)} />
                        <Route path="/messages" component={requireAuth(MessagesPage)} />
                        <Route path="/forgotPassword" component={ForgotPassword} />
                        <Route path="/resetPassword/:login" component={ResetPassword} />
                        <Route path="/profile" component={UserProfile} />
                        <Route path="/ModifProfile" component={ModifProfile} />
                        <Route path="/onboarding" component={Onboarding} />
                    </Switch>
                    <Footer />
                </div>
            </Router>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchCurrentUser: fetchCurrentUser}, dispatch);
}

export default connect(null, mapDispatchToProps)(App);



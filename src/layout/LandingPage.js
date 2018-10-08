import React, { Component } from 'react';
import SignupContainer from '../containers/SignupContainer';
import { connect } from 'react-redux';

class LandingPage extends Component {
    
    componentDidMount() {
        if (this.props.auth) {
            if (this.props.auth.authenticated) {
                this.props.history.push('/homepage');
            }
        }
    }
    
    render() {
        return (
            <div className="landing">
                <section className="hero is-fullheight">
                    <div className="hero-body firstPage">
                        <div className="container">
                            <div className="column">
                                <SignupContainer />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        auth: state.auth
    };
}

export default connect(mapStateToProps, null)(LandingPage);
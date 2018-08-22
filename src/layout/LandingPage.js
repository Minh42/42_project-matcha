import React, { Component } from 'react';
import SignupContainer from '../containers/SignupContainer';
import FlashMessagesList from '../components/FlashMessagesList';
import ReviewsContainer from '../containers/ReviewsContainer';
import step3 from '../../public/img/step3.png';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class LandingPage extends Component {
    
    // componentDidMount() {
    //     // console.log(this.state.auth)
    //     if (this.props.auth) {
    //         this.props.history.push('/homepage');
    //     }
    // }
    
    render() {
        return (
            <div>
                <section className="hero is-fullheight background">
                    <div className="hero-body">
                        <div className="container">
                            <FlashMessagesList />
                            <div className="columns">
                                <div className="column is-4 is-offset-1">
                                    <img src={step3} alt="step3" />
                                </div>
                                <div className="column is-5 is-offset-1">
                                    <SignupContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
    
                <section className="hero-body">
                    <div className="container">
                        <ReviewsContainer />
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

export default withRouter(connect(mapStateToProps, null)(LandingPage));
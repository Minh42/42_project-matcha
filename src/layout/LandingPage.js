import React from 'react';
import ReactDOM from 'react-dom';
// import CarouselContainer from '../containers/CarouselContainer';
import SignupContainer from '../containers/SignupContainer';
import FlashMessagesList from '../components/FlashMessagesList';
import ReviewsContainer from '../containers/ReviewsContainer';
import LoginContainer from '../containers/LoginContainer';
import step3 from '../../assets/img/step3.png' 

const LandingPage = () => {
    return (
        <div>
            <section className="hero is-info is-medium">
                <div className="hero-body hero-body-hp-main">
                    <div className="container">
                        <FlashMessagesList />
                        <div className="columns">
                            <div className="column is-4 is-offset-1">
                                <img src={step3} alt="step3" />
                            </div>
                            <div className="column is-6">
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

export default LandingPage;
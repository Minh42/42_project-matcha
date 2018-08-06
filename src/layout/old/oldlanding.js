import React from 'react';
import CarouselContainer from '../containers/CarouselContainer';
import SignupContainer from '../containers/SignupContainer';
import FlashMessagesList from '../components/FlashMessagesList';
import ReviewsContainer from '../containers/ReviewsContainer';

const LandingPage = () => {
    return (
        <div>
            <section className="hero is-info is-medium">
                <div className="hero-body hero-body-hp-main">
                    <div className="container">
                        <FlashMessagesList />
                        <div className="columns">
                            <div className="column is-4 is-offset-2">
                                <CarouselContainer />
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
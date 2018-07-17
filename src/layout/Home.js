import React from 'react';
import Carousel from '../containers/CarouselContainer';
import SignupContainer from '../containers/SignupContainer';

const contentStyle1 = {
    height: '80%'
}

const contentStyle2 = {
    backgroundColor:'orange'
}

const Home = () => {
    return (
        <div>
        <section className="hero">
            {/* <div className="container"> */}

                <div className="hero-body hero-body-hp-main">
                    <div className="container">
                        <div className="columns">
                            <div className="column is-4 is-offset-2">
                                <Carousel />
                            </div>
                        
                            <div className="column is-6">
                                <SignupContainer />
                            </div>
                        </div>
                    </div>
                
                </div>
            </section>
            <section className="hero-body" style={contentStyle2}>
                <div className="container">
                    <div className="row columns">
                        <div className="column is-one-third">
                            <div className="card medium">
                                <div className="card-image">
                                    <figure className="image">
                                        <img src="src/img/portugal.jpg" alt="portugal"/>
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="content">
                                    Portugal
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-one-third">
                            <div className="card medium">
                                <div className="card-image">
                                    <figure className="image">
                                        <img src="src/img/australie.jpg" alt="australie"/>
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="content">
                                    Voyage en Australie pour vivre vos rêves de bout de monde...
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="column is-one-third">
                            <div className="card medium">
                                <div className="card-image">
                                    <figure className="image">
                                        <img src="src/img/japon.jpg" alt="japon"/>
                                    </figure>
                                </div>
                                <div className="card-content">
                                    <div className="content">
                                    Japon
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
import React from 'react';
import ReactDOM from 'react-dom';
import CarouselContainer from '../containers/CarouselContainer';
import SignupContainer from '../containers/SignupContainer';
import FlashMessagesList from '../components/FlashMessagesList';
import ReviewsContainer from '../containers/ReviewsContainer';
import LoginContainer from '../containers/LoginContainer';

import Button from "../components/Button";

class LandingPage extends React.Component  {
    constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
	  }

    showModal() {
		document.getElementById('modal_signin').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal_signin').classList.remove("is-active");
    }

    render() {
        return (
            <div>
            <section className="hero is-fullheight background">
                    <div className="container">
                        <div className="columns is-mobile">
                            <div className="column is-2 is-offset-10">
                                <Button className="button is-medium is-fullwidth is-rounded buttonsignIn" title="Sign In" action={this.showModal}/>
                            </div>
                        </div>
                        <FlashMessagesList />
                        <div className="columns">
                            <div className="column is-4 is-offset-1">
                                <CarouselContainer />
                            </div>
                            <div className="column is-offset-2 is-4">
                                <SignupContainer />
                            </div>
                        </div>
                    </div>
            </section>

            <section className="hero-body">
                <div className="container">
                    <ReviewsContainer />
                </div>
            </section>

            <div className="modal" id='modal_signin'>
			    <div className="modal-background"></div>
                    <div className="modal-card">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Sign in to Matcha</p>
                            <button className="delete" aria-label="close" onClick={this.closeModal}></button>
                        </header>
                        <section className="modal-card-body">
                            <LoginContainer /> 
                        </section>
                </div>
			</div>
        </div>
        );                 
    }
}
export default LandingPage;
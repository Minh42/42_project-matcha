import React from 'react';
import ReactDOM from 'react-dom';
import FormContainer from './FormContainer';
import Button from "../components/Button";

const buttonStyle = {
    fontFamily: 'Amatic SC',
    fontWeight: 'bold',
    color: 'white',
    backgroundImage: '-moz-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: '-webkit-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: ':-o-linear-gradient(30deg, #F9BE02, #F53240)',
    backgroundImage: 'linear-gradient(60deg, #F9BE02, #F53240)',
	borderRadius: '30px',
	border: 'none',
    paddingLeft: '30px',
	paddingRight: '30px',
	fontSize: '18px'
  };

class SignupContainer extends React.Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.closeModalEmail = this.closeModalEmail.bind(this);
	  }

	showModal() {
		document.getElementById('modal').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal').classList.remove("is-active");
	}	

	closeModalEmail() {
		document.getElementById('modalEmail').classList.remove("is-active");
	}	

	render () {
	return (
		<div className="column is-6 is-offset-3">
			<div className="column">
				<h3 className="column is-12 title is-3">
					Discover another way to travel<br />
					Choose a destination<br />
					Meet new peoples or more<br />
					Share your passion<br />
					And Enjoy your trip!
				</h3>
			</div>
			<div>
				<Button className="button is-rounded" title="Create your account" action={this.showModal} style={buttonStyle}/>
			</div>
			 
			<div className="modal" id="modal">
			<div className="modal-background"></div>
			<div className="modal-card">
				<header className="modal-card-head">
				  <p className="modal-card-title">Sign Up</p>
				  <button className="delete" aria-label="close" onClick={this.closeModal}></button>
				</header>
				<section className="modal-card-body">
				 	<FormContainer />
				</section>
			</div>
			</div>

			<div class="modal" id="modalEmail">
			<div class="modal-background"></div>
			<div className="modal-card">
				<section className="modal-card-body">
					Veuillez confirmer votre compte :)
				<button class="modal-close is-large" aria-label="close" onClick={this.closeModalEmail}></button>
				</section>
			</div>
			</div>
		</div>
	)}
}

export default SignupContainer;
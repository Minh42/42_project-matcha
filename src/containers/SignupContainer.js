import React from 'react';
import ReactDOM from 'react-dom';
import FormContainer from './FormContainer';
import Button from "../components/Button";

class SignupContainer extends React.Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.closeModalEmail = this.closeModalEmail.bind(this);
	  }

	showModal() {
		document.getElementById('modalForm').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modalForm').classList.remove("is-active");
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
				<Button className="button is-rounded" id="button" title="Create your account" action={this.showModal} />
			</div>
			 
			<div className="modal" id="modalForm">
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

			<div className="modal" id="modalEmail">
			<div className="modal-background"></div>
			<div className="modal-card">
				<section className="modal-card-body">
					Veuillez confirmer votre compte :)
				<button className="modal-close is-large" aria-label="close" onClick={this.closeModalEmail}></button>
				</section>
			</div>
			</div>
		</div>
	)}
}

export default SignupContainer;
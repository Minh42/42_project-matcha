import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FormContainer from './FormContainer';
import Button from '../components/Button';
import { fetchCurrentUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import GoogleLoginButton from "react-social-login-buttons/lib/buttons/GoogleLoginButton";
import FacebookLoginButton from "react-social-login-buttons/lib/buttons/FacebookLoginButton";

const buttonStyle = {
	fontFamily: 'Lato',
	borderRadius: '30px',
	opacity:'0.9',
	whiteSpace: 'nowrap'
  };

class SignupContainer extends Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.closeModalEmail = this.closeModalEmail.bind(this);
		this.onSubmitGoogle = this.onSubmitGoogle.bind(this);
		this.onSubmitFacebook = this.onSubmitFacebook.bind(this);
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

	onSubmitGoogle() {
		location.href = "api/auth/google";
		this.props.fetchCurrentUser();
	}
	
	onSubmitFacebook() {
		location.href = "api/auth/facebook";
		this.props.fetchCurrentUser();
	}

	
	render () {
	return (
	<div>
		<div className="column main">
			<div className="column">
				<h1 className="text-box">
					<span className="heading-primary">Matcha</span>
					<span className="heading-secondary">Meet genuine people</span>
				</h1>
			</div>

			<div className="column">
				<div className="button-box">
					<Button className="button is-medium is-fullwidth btn btn-register" title="Create your account" action={this.showModal} />
					<span className="button-box-sub">Or</span>
					<GoogleLoginButton onClick={this.onSubmitGoogle} className="btn btn-google" style={buttonStyle} iconSize={"23px"}/>
					<FacebookLoginButton onClick={this.onSubmitFacebook} className="btn btn-facebook" style={buttonStyle} iconSize={"23px"}/>
				</div>
			</div>	
		</div>

		<div className="column">
			<div className="modal" id="modalForm">
				<div className="modal-background"></div>
				<div className="modal-card">
					<header className="modal-card-head modalHeader">
						<p className="modal-card-title titleSign" >Sign Up</p>
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
						<p className="is-primary">
							Please confirm your account
						</p>
					<button className="modal-close is-large" aria-label="close" onClick={this.closeModalEmail}></button>
					</section>
				</div>
			</div>
		</div>
	</div>
	)}
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		fetchCurrentUser: fetchCurrentUser
	}, dispatch);
}

export default connect(null, mapDispatchToProps)(SignupContainer);
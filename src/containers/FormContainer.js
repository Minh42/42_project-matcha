import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signUpAction } from '../actions/index';

import Button from '../components/Button';

import axios from 'axios';
import $ from 'jquery';

class FormContainer extends Component {
	
	// handleSubmit(event) {
		
	// 	var formData = {
    //         firstname: $("#firstname").val(),
    //         lastname: $("#lastname").val(),
    //         login: $("#login").val(),
    //         email: $("#email").val(),
    //         newPassword: $("#newPassword").val(),
	// 		confirmedPassword: $("#confirmedPassword").val()
	// 	}

	// 	axios({
	// 		method: 'post',
	// 		url: '/api/signup',
	// 		data: formData
	// 	})
	// 	.then((res) => {
	// 		console.log("Réponse : ", res.data);
	//   })
	// }

	renderField(field) {

		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label">{field.label}</label>
				<div className="control">
					<input
						className={className}
						value={field.value}
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.input}
					/>
				</div>
				<div className= "help is-danger">
					{touched ? error : ''}
				</div>
			</div>
		);
	}

	onSubmit (values){
		this.props.signUpAction(values);
	}

	render() {

		const { handleSubmit } = this.props;

		return (
			<form className="signup" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<Field
					label="Firstname"
					value=""
					name="firstName"
					type="text"
					component= {this.renderField}
					placeholder="First Name"
				/>
				<Field
					label="Lastname"
					name="lastName"
					type="text"
					component= {this.renderField}
					placeholder="Last Name"
				/>
				<Field
				 	label="Username"
					name="login"
					type="text"
					component= {this.renderField}
					placeholder="Username"
				/>
				<Field
				 	label="Email"
					name="email"
					type="email"
					component= {this.renderField}
					placeholder="Email"
				/>
				<Field
				 	label="Password"
					name="newPassword"
					type="password"
					component= {this.renderField}
					placeholder="******"
				/>
				<Field
				 	label="Confirmed password"
					name="confirmedPassword"
					type="password"
					component= {this.renderField}
					placeholder="******"
				/>
				<Button type='submit' id="button" className="button is-rounded" title="submit"/>
			</form>
		);
	}
}

function validate(values){

	let check = require('../../library/tools');
	const errors = {};

	if (!values.firstName)
		errors.firstName = "Please enter your firstname";
	else if (!check.isFirstname(values.firstName))
		errors.firstName = "Your firstname is invalid";

	if (!values.lastName)
		errors.lastName = "Please enter your lastname";
	else if (!check.isLastname(values.lastName))
		errors.lastName = "Your lastname is invalid";

	if (!values.login)
		errors.login = "Please enter your login";
	else if (!check.isUsername(values.login))
		errors.login = "Your login is invalid";

	if (!values.email)
		errors.email = "Please enter your email";
	else if (!check.isEmail(values.email))
		errors.email = "Your email is invalid";

	if (!values.newPassword)
		errors.newPassword = "Please enter your password";
	else if (!check.isPassword(values.newPassword))
		errors.newPassword = "Your password is invalid";0
		
	if (!values.confirmedPassword)
		errors.confirmedPassword = "Please enter your password a second time";
	else if (!check.isPassword(values.confirmedPassword))
		errors.confirmedPassword = "Your password is invalid";
	else if (values.newPassword !== values.confirmedPassword)
		errors.confirmedPassword= "Password not match";

	return errors;
}


export default reduxForm({
	validate,
	form : 'FormContainerForm'
}) (
	connect(null, { signUpAction })(FormContainer)
);
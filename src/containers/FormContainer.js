import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from '../components/Button';

import axios from 'axios';
import $ from 'jquery';

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
    paddingRight: '30px'
  };

class FormContainer extends Component {
	
	handleSubmit(event) {
		
		var formData = {
            firstname: $("#firstname").val(),
            lastname: $("#lastname").val(),
            login: $("#login").val(),
            email: $("#email").val(),
            newPassword: $("#newPassword").val(),
			confirmedPassword: $("#confirmedPassword").val()
		}

		axios({
			method: 'post',
			url: '/api/signup',
			data: formData
		})
		.then((res) => {
			console.log("Réponse : ", res.data);
	  })
	}

	renderField(field) {
		return (
			<div className="field">
				<label className="label">{field.label}</label>
				<div className="control">
					<input
						className="input"
						type={field.type}
						placeholder={field.placeholder}
						{ ...field.input}
					/>
				</div>
				{field.meta.touched ? field.meta.error : ''}
			</div>
		);
	}

	onSubmit (values){
	console.log(values);
	}

	render() {

		const { handleSubmit } = this.props;

		return (
			<form className="signup" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<Field
				 	label="Firstname"
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
					placeholder="*****"
				/>
				<Field
				 	label="Confirmed password"
					name="confirmedPassword"
					type="password"
					component= {this.renderField}
					placeholder="*****"
				/>
				<Button type='submit' className="button is-rounded" title="submit" style={buttonStyle}/>
			</form>
		);
	}
}

function validate(values){


	const errors = {};

	if (!values.firstName)
		errors.firstName = "Please enter your firstname";
	// else if (!check.isFirstname(values.firstName))
	// 	errors.firstName = "Your firstname is invalid";

	if (!values.lastName)
		errors.lastName = "Please enter your lastname";
	if (!values.login)
		errors.login = "Please enter your login";
	if (!values.email)
		errors.email = "Please enter your email";
	if (!values.newPassword)
		errors.newPassword = "Please enter your password";
	if (!values.confirmedPassword)

	return errors;
}


export default reduxForm({
	validate,
	form : 'FormContainerForm'
}) (FormContainer);
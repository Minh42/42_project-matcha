import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';

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

	renderFirstnameField(field) {
		return (
			<div>
				<input
					type={field.type}
					{ ...field.input}
				/>
			</div>
		);
	}

	render() {
		return (
			<form className="signup" onSubmit={this.handleSubmit}>
				<Field
					name="firstName"
					type="text"
					component= {renderFirstnameField}
					type="text"
					placeholder="First Name"
				/>
				<Field
					name="lastName"
					type="text"
					component="input"
					type="text"
					placeholder="Last Name"
				/>
				<Field
					name="login"
					type="text"
					component="input"
					type="text"
					placeholder="Username"
				/>
				<Field
					name="email"
					type="email"
					component="input"
					type="text"
					placeholder="Email"
				/>
				<Field
					name="newPassword"
					type="password"
					component="input"
					type="text"
					placeholder="*****"
				/>
				<Field
					name="confirmedPassword"
					type="password"
					component="input"
					type="text"
					placeholder="*****"
				/>
				<Button type='submit' className="button is-rounded" title="submit" style={buttonStyle}/>
			</form>
		);
	}
}
export default reduxForm({
	form : 'FormContainerForm'
}) (FormContainer);
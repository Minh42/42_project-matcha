import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { signUpAction } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import Button from '../components/Button';

class FormContainer extends Component {

	componentDidMount() {
		const initData = {
			"firstName": null,
			"lastName": null,
			"login" : null,
			"email": null,
			"newPassword": null,
			"confirmedPassword": null
		};
		this.props.initialize(initData)
	}

	renderField(field) {
		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label labelSign">{field.label}</label>
				<div className={field.icon ? "control has-icons-left" : ''}>
                    <span className={field.icon ? "icon is-small is-left" : ''}>
                        <i className={field.icon}></i>
                    </span>
					<input
						className={className}
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
		this.props.signUpAction(values, this.props.history);
	}

	errorMessage() {
		if (this.props.errorMessage) {
			console.log(this.props.errorMessage)
			if (this.props.errorMessage === "Please enter all the informations") {
				return (
					<p className="help is-danger">
						{this.props.errorMessage}
					</p>
				);
			} else if (this.props.errorMessage === "Your passwords not match") {
				return (
					<p className="help is-danger">
						{this.props.errorMessage}
					</p>
				);
			} else {
				return (
					<p className="help is-danger">
						{this.props.errorMessage}
					</p>
				);
			}
		}
	}

	render() {

		const { handleSubmit } = this.props;

		return (
			<form name="signup" className="signup" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
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
					icon="fas fa-user"
					component= {this.renderField}
					placeholder="Username"
				/>
				<Field
				 	label="Email"
					name="email"
					type="email"
					icon="fas fa-envelope"
					component= {this.renderField}
					placeholder="Email"
				/>
				<Field
				 	label="Password"
					name="newPassword"
					type="password"
					icon="fas fa-lock"
					component= {this.renderField}
					placeholder="**********"
				/>
				<Field
				 	label="Confirmed password"
					name="confirmedPassword"
					type="password"
					icon="fas fa-lock"
					component= {this.renderField}
					placeholder="**********"
				/>
				<Button type='submit' className="button buttonOnboarding" title="Submit"/>
				{this.errorMessage()}
			</form>
		);
	}
}

function validate(values) {
	let check = require('../../library/tools');
	const errors = {};

	if (!values.firstName)
		errors.firstName = "Please enter your firstname";
	else if (!check.isFirstname(values.firstName))
		errors.firstName = "Firstname must contain between 1 and 32 alphabetic characters";

	if (!values.lastName)
		errors.lastName = "Please enter your lastname";
	else if (!check.isLastname(values.lastName))
		errors.lastName = "Lastname must contain between 1 and 32 alphabetic characters";

	if (!values.login)
		errors.login = "Please enter your username";
	else if (!check.isUsername(values.login))
		errors.login = "Username must contain between 5 and 16 characters";

	if (!values.email)
		errors.email = "Please enter your email";
	else if (!check.isEmail(values.email))
		errors.email = "Your email is invalid";

	if (!values.newPassword)
		errors.newPassword = "Please enter your password";
	else if (!check.isPassword(values.newPassword))
		errors.newPassword = "Your password is invalid";
		
	if (!values.confirmedPassword)
		errors.confirmedPassword = "Please enter your password a second time";
	else if (!check.isPassword(values.confirmedPassword))
		errors.confirmedPassword = "Your password is invalid";
	else if (values.newPassword !== values.confirmedPassword)
		errors.confirmedPassword= "Password not match";

	return errors;
}

FormContainer.propTypes = {
	errorMessage: PropTypes.string,
	signUpAction: PropTypes.func.isRequired
};

function mapStateToProps(state) {
	return { errorMessage : state.signup.error };
}

function mapDispatchToProps(dispatch) { 
	return bindActionCreators({ signUpAction : signUpAction}, dispatch);
} 

const reduxFormSignUp = reduxForm({
	form : 'signup',
	validate
})(FormContainer);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxFormSignUp));

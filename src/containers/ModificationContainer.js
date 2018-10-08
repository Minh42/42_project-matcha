import React from 'react';
import { Field, reduxForm } from 'redux-form';
import Button from "../components/Button";
import renderField from '../components/renderField'
import axios from 'axios';

class ModificationContainer extends React.Component{

	constructor() {
        super()
        this.state = {
			messagesSuccess : "",
			messagesErrors: ""
        }
    }

	componentDidMount() {
		this.handleInitialize();
	}
	
	async handleInitialize() {
		const initData = {
			"login": this.props.user.username,
			"firstName": this.props.user.firstname,
			"lastName": this.props.user.lastname,
			"email": this.props.user.email
		};
		this.props.initialize(initData);
	  }

	async onSubmit (values){
		const res = await axios.post(`/api/modifData`, values);
		if (res.data === "success") {
			this.setState({
				messagesSuccess: 'modifications changed'
			})
		} else if (res.data === "failure") {
			this.setState({
				messagesErrors: 'please use a unique username or email'
			})
		}
	}

	renderMessages() {
		if (this.state.messagesSuccess) {
			return (
				<p className="help is-success">{this.state.messagesSuccess}</p>
			)
		}
		if (this.state.messagesErrors) {
			return (
				<p className="help is-danger">{this.state.messagesErrors}</p>	
			)
		}
	}

	render () {
		const { handleSubmit } = this.props;
	return (
			<form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
			<Field
				label="Username"
				name="login"
				type="text"
				icon="fas fa-user"
				component= {renderField}
				placeholder="Username"
			/>
			<Field
				label="Firstname"
				name="firstName"
				type="text"
				component= {renderField}
				placeholder="First Name"
			/>
			<Field
				label="Lastname"
				name="lastName"
				type="text"
				component= {renderField}
				placeholder="Last Name"
			/>
			<Field
			 	label="Email"
				name="email"
				type="email"
				icon="fas fa-envelope"
				component= {renderField}
				placeholder="Email"
			/>
	         { this.renderMessages() }
			<Button type="submit" className="button is-small is-fullwidth buttonOnboarding" title="Change these informations"/>
			</form>
	)}
}

function validate(values) {
	let check = require('../../library/tools');
	let errors = {};

	if (!values.firstName)
		errors.firstName = "Please enter your firstname";
	else if (!check.isFirstname(values.firstName))
		errors.firstName = "Firstname must contain only alphabetic characters";

	if (!values.lastName)
		errors.lastName = "Please enter your lastname";
	else if (!check.isLastname(values.lastName))
		errors.lastName = "Lastname must contain only alphabetic characters";

	if (!values.login)
		errors.login = "Please enter your username";
	else if (!check.isUsername(values.login))
		errors.login = "Username must contain between 5 and 16 characters";

	if (!values.email)
		errors.email = "Please enter your email";
	else if (!check.isEmail(values.email))
		errors.email = "Your email is invalid";

	return errors;
}

const reduxFormModificationContainer = reduxForm({
	validate,
	form : 'modifUser',
	initialValues : {
		login: null
	}
}) (ModificationContainer)

export default reduxFormModificationContainer;
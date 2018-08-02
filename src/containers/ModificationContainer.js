import React from 'react';
import ReactDOM from 'react-dom';
import { Field, reduxForm } from 'redux-form';
import Button from "../components/Button";

import axios from 'axios';

class ModificationContainer extends React.Component{

	renderField(field) {
		const { meta: { touched, error } } = field;
		const className= `input ${touched && error ? 'is-danger' : ''}`;

		return (
			<div className= "field">
				<label className="label">{field.label}</label>
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

	componentDidMount() {
		this.handleInitialize();
	}
	
	async handleInitialize() {
		const res = await axios.get('/api/infoUser');
		const initData = {
			"user_id": res.data[0].user_id,
			"login": res.data[0].username,
			"firstName": res.data[0].firstname,
			"lastName": res.data[0].lastname,
			"email": res.data[0].email
		};
		console.log(initData)
		this.props.initialize(initData);
	  }

	async onSubmit (values){
		console.log(values)
		const res = await axios.post(`/api/modifData`, values)
        console.log(res)
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
				component= {this.renderField}
				placeholder="Username"
			/>
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
			 	label="Email"
				name="email"
				type="email"
				icon="fas fa-envelope"
				component= {this.renderField}
				placeholder="Email"
			/>
			<Button type="submit" className="button is-rounded" title="Change these informations"/>
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
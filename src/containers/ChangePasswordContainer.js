import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import renderField from '../components/renderField'

import axios from 'axios';

class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
           messagesSuccess : ""
        }
    }

   async onSubmit(values) {
        const res = await axios.post('/api/changePassword', values)
        const success = res.data.success
        this.setState({
            messagesSuccess : success
        })
    }

    render () {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<Field
					label="Enter your new password"
					name="newPassword"
					type="password"
					component={renderField}
				/>
				<Field
					label="Confirm your new password"
					name="confirmedNewPassword"
					type="password"
					component={renderField}
				/>
				<h1 className="helpMessages help is-success">{ this.state.messagesSuccess }</h1>
				<h1 className="helpMessages help is-danger">{ this.state.messagesError }</h1>
				<button type="submit" className="button is-small is-fullwidth buttonOnboarding">Submit</button>
			</form>
        );
    }
}

function validate(values) {
    let check = require('../../library/tools');
    const errors = {};
    
    if (!values.newPassword) 
        errors.newPassword = "Please enter your new password"
    else if (!check.isPassword(values.newPassword))
        errors.newPassword = "Your new password is invalid";

    if (!values.confirmedNewPassword)
        errors.confirmedNewPassword = "Please confirm your new password"
    else if (!check.isPassword(values.confirmedNewPassword))
        errors.confirmedNewPassword = "Your confirmation password is invalid";
    else if (values.newPassword !== values.confirmedNewPassword)
		errors.confirmedNewPassword = "Password not match";

    return errors;
}

const reduxResetPassword = reduxForm({
    validate,
    form: 'reset'
})(ResetPassword);

export default reduxResetPassword;
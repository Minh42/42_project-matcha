import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';

import axios from 'axios';

class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
           messagesSuccess : ""
        }
    }

    renderField(field) {
        const { meta: { touched, error } } = field;
        const danger = `input ${touched && error ? 'is-danger' : ''}`;

        return (
            <div className="field">
                <label className="label">{field.label}</label>
                <div className="control">
                    <input 
                        className={danger}
                        type={field.type}
                        {...field.input}
                    />
                    <div className="help is-danger">
                        {touched ? error : ''}
                    </div>
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
		};
		console.log(initData)
		this.props.initialize(initData);
	  }

   async onSubmit(values) {
        const res = await axios.post('/api/changePassword', values)
    }

    render () {
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
				<Field
					label="Enter your new password"
					name="newPassword"
					type="password"
					component={this.renderField}
				/>
				<Field
					label="Confirm your new password"
					name="confirmedNewPassword"
					type="password"
					component={this.renderField}
				/>
				<h1 className="messages help is-success">{ this.state.messagesSuccess }</h1>
				<h1 className="messages help is-danger">{ this.state.messagesError }</h1>
				<button type="submit" className="button is-rounded">Submit</button>
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
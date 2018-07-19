import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import axios from 'axios';
import $ from 'jquery';

class ResetPassword extends Component {

    constructor() {
        super()
        this.state = {
            messagesSuccess : "",
            messagesError : ""
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

    async onSubmit(values) {
        const res = await axios.post('/api/sendNewPassword', values)
    }

    render () {
        const { handleSubmit } = this.props;
        return (
            <div className="container has-text-centered">
                <div className="column is-4 is-offset-4">
                    <div className="box">
                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                            <Field
                                label="Enter your new password"
                                name="newPasswordReset"
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
                    </div>
                </div>
            </div>
        );
    }
}

function validate(values) {
    let check = require('../../library/tools');
    const errors = {};
    
    if (!values.newPasswordReset) 
        errors.newPasswordReset = "Please enter your new password"
    else if (!check.isPassword(values.newPasswordReset))
        errors.newPasswordReset = "Your new password is invalid";

    if (!values.confirmedNewPassword)
        errors.confirmedNewPassword = "Please confirm your new password"
    else if (!check.isPassword(values.confirmedNewPassword))
        errors.confirmedNewPassword = "Your confirmation password is invalid";
    else if (values.newPasswordReset !== values.confirmedNewPassword)
		errors.confirmedNewPassword = "Password not match";

    return errors;
}

const reduxResetPassword = reduxForm({
    validate,
    form: 'reset'
})(ResetPassword);

export default withRouter(connect(null, null)(reduxResetPassword));
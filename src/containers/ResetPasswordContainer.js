import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import renderField from '../components/renderField'

import axios from 'axios';

class ResetPassword extends Component {

    constructor(props) {
        super(props)
        this.state = {
           user_id : this.props.match.params.id,
           messagesSuccess : ""
        }
    }

    componentDidMount() {
        console.log('i came here')
    }

   async onSubmit(values) {
        var dataReset = { newPasswordReset : values.newPasswordReset,
                        confirmedNewPassword : values.confirmedNewPassword,
                        user_id : this.state.user_id
                        }
        const res = await axios.post('/api/sendNewPassword', dataReset)
        window.location = res.data.redirect;
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
                                component={renderField}
                            />
                            <Field
                                label="Confirm your new password"
                                name="confirmedNewPassword"
                                type="password"
                                component={renderField}
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
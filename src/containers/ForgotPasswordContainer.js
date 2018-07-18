import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
// import { signInAction } from '../actions/actionUsers';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

import axios from 'axios';

class ForgotPassword extends Component {
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
        console.log(values);
        const res = await axios.post('/api/forgotpassword', values)
            .then (res => {
            console.log(res);
        })
    }

    render () {
        const { handleSubmit } = this.props;

        return (
            <div className="container has-text-centered">
                <div className="column is-4 is-offset-4">
                    <div className="box">
                        <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                            <Field
                                label="Please enter your email"
                                name="email"
                                type="email"
                                component={this.renderField}
                            />
                            <button type="submit" className="button is-rounded">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

function validate(values) {
    const errors = {};
    if (!values.email) {
        errors.email = "Please enter your email"
    }
    return errors;
}

const reduxFormForgot = reduxForm({
    validate,
    form: 'forgot'
})(ForgotPassword);

export default withRouter(connect(null, null)(reduxFormForgot));
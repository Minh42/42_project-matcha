import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
// import { signInAction } from '../actions/actionUsers';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import renderField from '../components/renderField'

import axios from 'axios';
import $ from 'jquery';

class ForgotPassword extends Component {

    constructor() {
        super()
        this.state = {
            messagesSuccess : "",
            messagesError : ""
        }
    }

    // componentDidMount() {
    //     document.getElementById('modal_signin').classList.remove("is-active");
    // }
    
    // renderField(field) {
    //     const { meta: { touched, error } } = field;
    //     const danger = `input ${touched && error ? 'is-danger' : ''}`;

    //     return (
    //         <div className="field">
    //             <label className="label">{field.label}</label>
    //             <div className="control">
    //                 <input 
    //                     className={danger}
    //                     type={field.type}
    //                     {...field.input}
    //                 />
    //                 <div className="help is-danger">
    //                     {touched ? error : ''}
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    async onSubmit(values) {
        var success;
        var error;
        const res = await axios.post('/api/forgotpassword', values)
        if (res.data.success === true) {
            success = "You can check your email and reset your password";
            error = "";
        }
        else if (res.data.error === true) {
            error = "this email doesn't exist";
            success = "";
        }
        this.setState({
            messagesSuccess: success,
            messagesError: error
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
                                component={renderField}
                            />
                             <h1 className="messages help is-success">{ this.state.messagesSuccess }</h1>
                             <h1 className="messages help is-danger">{ this.state.messagesError }</h1>
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
        $('.messages').text("");
    }
    return errors;
}

const reduxFormForgot = reduxForm({
    validate,
    form: 'forgot'
})(ForgotPassword);

export default withRouter(connect(null, null)(reduxFormForgot));
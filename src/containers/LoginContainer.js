import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';

class LoginContainer extends Component {
    renderField(field) {
        const { meta: { touched, error } } = field;
        const danger = `input ${touched && error ? 'is-danger' : ''}`;

        return (
            <div className="field">
                <label className="label">{field.label}</label>
                <div className="control has-icons-left">
                    <span className="icon is-small is-left">
                        <i className={field.icon}></i>
                    </span>
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

    onSubmit(values) {
        console.log(values);
    }

    render () {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <Field
                    label="Username"
                    name="username"
                    type="text"
                    icon="fas fa-user"
                    component={this.renderField}
                />
                <Field
                    label="Password"
                    name="password"
                    type="password"
                    icon="fas fa-lock"
                    component={this.renderField}
                />
                <button type="submit" className="button is-rounded" id="button">Submit</button>
            </form>
        );
    }
}

function validate(values) {
    // console.log(values);
    const errors = {};
    if (!values.username) {
        errors.username = "Please enter a username"
    }
    if (!values.password) {
        errors.password = "Please enter a password"
    }
    return errors;
}

export default reduxForm({
    validate,
    form: 'login'
})(LoginContainer);
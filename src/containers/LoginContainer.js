import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { signInAction } from '../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
        this.props.signInAction(values, this.props.history);
    }

    errorMessage() {
        if (this.props.errorMessage) {
            return (
                <p class="help is-danger">
                    {this.props.errorMessage}
                </p>
            );
        }
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
                <button type="submit" className="button is-rounded" id="button">Sign In</button>
                {this.errorMessage()}
            </form>
        );
    }
}

function validate(values) {
    // let check = require('../../library/tools');
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

function mapStateToProps(state) {
    return { errorMessage: state.auth.error };
}

/* Anything returned from this function will show up as propsi nside of LoginContainer */
function mapDispatchToProps(dispatch) {
    /* Whenever signInAction is called, the result should be passed to all our reducers
        through the dispatch function */
    return bindActionCreators({ signInAction: signInAction}, dispatch);
}

const reduxFormSignin = reduxForm({
    validate,
    form: 'signin'
})(LoginContainer);

export default connect(null, mapDispatchToProps)(reduxFormSignin);
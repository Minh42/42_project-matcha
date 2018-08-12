import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { signInAction } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Button from '../components/Button';

class LoginContainer extends Component {    
    renderField(field) {
        const { meta: { touched, error } } = field;
        const danger = `input ${touched && error ? 'is-danger' : ''}`;

        return (
            <div className="field">
                <label className="label labelSign">{field.label}</label>
                <div className="control has-icons-left">
                    <span className="icon is-small is-left">
                        <i className={field.icon}></i>
                    </span>
                    <input 
                        className={danger}
                        type={field.type}
                        placeholder={field.placeholder}
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
                <p className="help is-danger">
                    {this.props.errorMessage}
                </p>
            );
        }
    }

    render () {
        
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                {this.errorMessage()}
                <Field
                    label="Username"
                    name="username"
                    type="text"
                    icon="fas fa-user"
                    placeholder="Username"
                    component={this.renderField}
                />
                <Field
                    label="Password"
                    name="password"
                    type="password"
                    icon="fas fa-lock"
                    placeholder="Password"
                    component={this.renderField}
                />
                <div className="field">
                    <div>
                        <p className="control">
                            <Button type="submit" className="button is-rounded buttonOnboarding" title="Sign In" />
                        </p>
                    </div>
                    <div>
                        <p className="control">
                            <Link to="/forgotPassword">Forgot password ?</Link>  
                        </p>
                    </div>
                </div>
            </form>
        );
    }
}

LoginContainer.propTypes = {
	errorMessage: PropTypes.string,
	signInAction: PropTypes.func.isRequired
};

function validate(values) {
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
    return { 
        errorMessage: state.auth.error 
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ signInAction: signInAction}, dispatch);
}

const reduxFormSignin = reduxForm({
    validate,
    form: 'signin'
})(LoginContainer);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxFormSignin));
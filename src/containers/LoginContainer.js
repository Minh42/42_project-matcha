import React, {Component} from 'react';
import { Field, reduxForm } from 'redux-form';
import { signInAction } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import LinkButton from "../components/LinkButton";
import PropTypes from 'prop-types';
import Button from '../components/Button';
import { connectSocket } from '../actions/actionSocket';

class LoginContainer extends Component {
    
    componentDidMount() {
        const initData = {
            "username": null,
            "password": null
        };
        this.props.initialize(initData);
    }

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
        this.props.connectSocket();
    }

    errorMessage() {
        if (this.props.errorMessage) {
            return (
                <p className="help is-danger">
                    {this.props.errorMessage.error}
                </p>
            );
        } else {
            return;
        }
    }


    handleModal() {
        document.getElementById('modal_signin').classList.remove("is-active");
    }

    render () {
        
        const { handleSubmit } = this.props;

        return (
            <form name="signing" className="signin" onSubmit={handleSubmit(this.onSubmit.bind(this))}>
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
                {this.errorMessage()}
                <div className="field">
                    <div>
                        <p className="control">
                            <Button type="submit" className="button buttonOnboarding" title="Sign In" />
                        </p>
                    </div>
                    <div>
                        <p className="control">
                            <LinkButton to='/forgotPassword' onClick={this.handleModal} className="forgotPassword">Forgot password ?</LinkButton>
                        </p>
                    </div>
                </div>
            </form>
        );
    }
}

LoginContainer.propTypes = {
	errorMessage: PropTypes.object,
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
        errorMessage: state.auth
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        signInAction: signInAction,
        connectSocket: connectSocket
    }, dispatch);
}

const reduxFormSignin = reduxForm({
    validate,
    form: 'signin'
})(LoginContainer);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(reduxFormSignin));
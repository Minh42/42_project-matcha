import React, { Component } from 'react';
import LoginContainer from '../containers/LoginContainer';
import Button from "../components/Button";
import LinkButton from "../components/LinkButton";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutAction } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';

class Header extends Component {
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            firstname : "",
            lastname : "",
        }
        this.socket = io('ws://localhost:8080', {transports: ['websocket']});
	  }

	showModal() {
		document.getElementById('modal_signin').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal_signin').classList.remove("is-active");
    }

    handleLogout() {
        this.socket.emit('disconnect_user', this.props.currentUser[0].user_id);
        this.props.signOutAction(this.props.history);
    }

    showNavbar() {
    if(this.props.history.location.pathname === '/onboarding') {
        return;
    } else {
        if (this.props.auth) {
            if (this.props.auth.authenticated != undefined) {
                switch (this.props.auth.authenticated) {
                    case null:
                        return;
                    case false:
                        return [
                            <Button key="login" className="button is-rounded btn btn-login" title="Sign In" action={this.showModal}/>
                        ];
                    default:
                        return [
                            <p key="homepage" className="control navbar-item">
                                <Link to="/homepage"><Button className="button buttonHeader" title=" Homepage"/></Link>
                            </p>,
                            <p key = "messages" className="control navbar-item">
                                <Link to="/messages"><Button className="button buttonHeader" title="My messages"/></Link>
                            </p>,
                            <p key = "profile" className="control navbar-item">
                                <LinkButton to='/profile' className="button buttonHeader">My profile</LinkButton>
                            </p>,
                            <p key = "logout" className="control navbar-item">
                                <LinkButton to='/' onClick={this.handleLogout} className="button buttonHeader">Signout</LinkButton>
                            </p>
                        ];
                    }
                }
            } 
        }
    }

    render() {
        return (
			<nav className="navbar">
                <div className="navbar-brand">

                    <a className="navbar-item" id="logo">
                       <span> MATCHA </span>
                    </a>

                    <div id="navbar-burger-id" className="navbar-burger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div >
                    <div className="navbar-start">
                    </div>
                </div>

                <div className="navbar-end">
                    <div id="navbar-menu-id" className="navbar-menu">
                        <div className="navbar-start navbar-item">
                            {this.showNavbar()}
                        </div>
                    </div>
                    <div className="modal" id='modal_signin'>
			        <div className="modal-background"></div>
                        <div className="modal-card">
                            <header className="modal-card-head modalHeader">
                                <p className="modal-card-title titleSign">Sign in to Matcha</p>
                                <button className="delete" aria-label="close" onClick={this.closeModal}></button>
                            </header>
                            <section className="modal-card-body">
                                <LoginContainer /> 
                            </section>
                        </div>
			        </div>
                </div>
            </nav>
        );                 
    }
}

function mapStateToProps(state) {
    return { 
        auth: state.auth,
        currentUser: state.auth.currentUser
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        signOutAction: signOutAction
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
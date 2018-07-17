import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginContainer from '../containers/LoginContainer';
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutAction } from '../actions/index';
import { bindActionCreators } from 'redux';

class Header extends Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
	  }

	showModal() {
		document.getElementById('modal_signin').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal_signin').classList.remove("is-active");
    }

    handleClick() {
        console.log('IM HERE DUDESS')
        // this.props.signOutAction(this.props.history);
    }

    showNavbar() {
        if (this.props.authenticated) {
            return [
                <p className="control">
                    <Link to="/messages"><Button className="button is-rounded" title="My messages"/></Link>
                </p>,
                <p className="control">
                    <Link to="/profile"><Button className="button is-rounded" title="My profile"/></Link>
                </p>,
                <p className="control">
                    <Link to="/signout"><Button className="button is-rounded" title="Signout" onClick={this.handleClick.bind(this)}/></Link>  
                </p>
            ];
        }
        return [
            <Button className="button is-rounded" title="Sign In" action={this.showModal}/>
        ];
    }

    render() {
        return (
            <nav className="navbar">

                <div className="navbar-brand">

                    <a className="navbar-item" id="logo">
                       <span> MATCHA </span>
                    </a>

                    <div className="navbar-burger burger" data-target="mobile-app">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>

                <div id="mobile-app" className="navbar-menu">
                    <div className="navbar-start">
                    </div>
                </div>

                <div className="navbar-end">
                    <div className="navbar-item">
                        <div className="field is-grouped">
                            {this.showNavbar()}
                        </div>
                    </div>
                    <div className="modal" id="modal_signin">
			        <div className="modal-background"></div>
                        <div className="modal-card">
                            <header className="modal-card-head">
                                <p className="modal-card-title">Sign In</p>
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
        authenticated: state.auth.authenticated 
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ signOutAction: signOutAction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
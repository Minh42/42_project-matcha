import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginContainer from '../containers/LoginContainer';
import Button from "../components/Button";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Header extends Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
	  }

	showModal() {
		document.getElementById('modal').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal').classList.remove("is-active");
    }	
    
    showNavbar() {
        if (this.props.authenticated) {
            return [
                <p class="control">
                    <Link to="/messages"><Button className="button is-rounded" title="My messages"/></Link>
                </p>,
                <p class="control">
                    <Link to="/profile"><Button className="button is-rounded" title="My profile"/></Link>
                </p>,
                <p class="control">
                    <Link to="/signout"><Button className="button is-rounded" title="Signout"/></Link>  
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
                    <div className="modal" id="modal">
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

export default connect(mapStateToProps)(Header);
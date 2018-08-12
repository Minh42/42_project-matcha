import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import LoginContainer from '../containers/LoginContainer';
import Button from "../components/Button";
import LinkButton from "../components/LinkButton"
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutAction } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

import axios from 'axios';

class Header extends Component{
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);

        this.state = {
            firstname : "",
            lastname : ""
        }
	  }

	showModal() {
		document.getElementById('modal_signin').classList.add("is-active");
	}
	
	closeModal() {
		document.getElementById('modal_signin').classList.remove("is-active");
    }

    handleLogout() {
        this.props.signOutAction();
    }

    // async componentDidMount() {
        // var first;
        // var last;
        // var res = await axios.get(`/api/infoUser`)
        // first = res.data[0].firstname;
        // last = res.data[0].lastname;
        // this.setState({
        //     firstname: first,
        //     lastname: last
        // })
    //   }

    showNavbar() {
        console.log(this.props.authenticated)
        switch (this.props.authenticated) {
            case null:
                return;
            case false:
                return [
                    <Button className="button is-rounded" title="Sign In" action={this.showModal}/>
                ];
            default:
                return [
                    // <h3>hello {this.state.firstname} </h3>,
                    <p className="control">
                        <Link to="/homepage"><Button className="button is-rounded" title=" homepage"/></Link>
                    </p>,
                    <p className="control">
                        <Link to="/messages"><Button className="button is-rounded" title="My messages"/></Link>
                    </p>,
                    <p className="control">
                        <Link to="/profile"><Button className="button is-rounded" title="My profile"/></Link>
                    </p>,
                    <p className="control">
                        <LinkButton to='/' onClick={this.handleLogout} className="button is-rounded">Signout</LinkButton>
                    </p>
            
                ];
        }
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
        authenticated: state.auth.authenticated
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ signOutAction: signOutAction}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
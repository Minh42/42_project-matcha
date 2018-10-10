import React, { Component } from 'react';
import LoginContainer from '../containers/LoginContainer';
import LinkButton from "../components/LinkButton";
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutAction } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import io from 'socket.io-client';

import { Badge, Button, SVGIcon } from 'react-md';
import axios from 'axios';

class Header extends Component {
	constructor(props) {
		super(props);
		this.showModal = this.showModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.showDialog = this.showDialog.bind(this);

        this.state = {
            firstname : "",
            lastname : "",
            notification: false,
            message: '',
            numberNotification: 0
        }

        this.socket = io('ws://localhost:8080', {transports: ['websocket']});
    }

    async componentDidMount() {
        const res = await axios.post('/api/searchNotifications')

        this.setState ({
            numberNotification: res.data.length
        })
    }

	showModal() {
		document.getElementById('modal_signin').classList.add("is-active");
    }
  
	closeModal() {
        document.getElementById('modal_signin').classList.remove("is-active");
    }

    // NOTIFICATIONS
    async showDialog() {
        document.getElementById('modal_dialog').classList.add("is-active");
        const res = await axios.post('/api/searchNotifications')
        console.log(res.data)
        if (res.data.length === 0) {
            this.setState ({
                notification: false
            })
        } else {
            this.setState ({
                notification: res.data
            })
        }
	}
	
    closeDialog() {
        document.getElementById('modal_dialog').classList.remove("is-active");
    }

    async closeNotification(notification_id) {
        console.log('state notif:', this.state.notification)
        console.log('notif id:', notification_id)
        // mettre status de notif_object a 1
        const res = await axios.post('/api/changeStatusNotification', { notification_id : notification_id }) 
        //parcourir state notification et supprimer le message qui a notification_id
        if (res) {
            const res = await axios.post('/api/searchNotifications')
            if (res.data.length === 0) {
                this.setState ({
                    notification: false,
                    numberNotification: 0
                })
            } else {
                this.setState ({
                    notification: res.data,
                    numberNotification: res.data.length
                })
            }
        }
        //aller sur profile au clic
    }

    allNotifiactions() {
        if (this.state.notification !== false ) {
            return this.state.notification.map((notif, i) => {
                return (
                    <div key={i}>
                        <div className="card-content">
                            <div className="card columns">
                                <div className="column is-8 is-offset-3">
                                    <p> {notif[0].firstname} {notif[0].lastname} {notif[notif.length - 2]}</p>
                                </div>
                                <div className="column is-1">
                                    <button className="delete" aria-label="close" onClick={() => this.closeNotification(notif[notif.length - 1])}></button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })    
        } else {
            return (
                <div>no notifications</div>
            )
        }
    }

    //END

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
                            <button key="login" className="button is-rounded btn btn-login" onClick={this.showModal}>Sign In</button>
                        ];
                    default:
                        return [
                            <Badge key="badge" id="icontext" badgeContent={this.state.numberNotification} primary badgeId="notifications-1" onClick={this.showDialog}>
                               <i className="fas fa-envelope" id="icon"></i>
                            </Badge>,
                            <p key="homepage" className="control navbar-item">
                                <LinkButton to="/homepage" className="button buttonHeader">Homepage</LinkButton>
                            </p>,
                            <p key = "messages" className="control navbar-item">
                                <LinkButton to="/messages" className="button buttonHeader">My messages</LinkButton>
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

                    <div className="modal" id='modal_dialog'>
			        <div className="modal-background"></div>
                        <div className="modal-card">
                            <header className="modal-card-head modalHeader">
                                <p className="modal-card-title titleSign">your notifications</p>
                                <button className="delete" aria-label="close" onClick={this.closeDialog}></button>
                            </header>
                            <section className="modal-card-body">
                                {this.allNotifiactions()}
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
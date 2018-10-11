import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { sendNotification } from '../actions/actionNotifications';
import { bindActionCreators } from 'redux';
import axios from 'axios';
import LazyLoad from 'react-lazy-load';

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            like : false
        }
        this.signal = axios.CancelToken.source();
        this.showProfile = this.showProfile.bind(this)
        this.handleLike = this.handleLike.bind(this)
    }

    async componentDidMount() {
        try {
            const res = await axios.get('/api/searchLikeProfileUser', { cancelToken: this.signal.token });
            for (var i = 0; i < res.data.length; i++) {
                if (res.data[i].to_user_id === this.props.id) {
                    this.setState({like : true})
                }
            }
        } catch (err) {
            if (axios.isCancel(err)) {
                // console.log(err.message); 
            }
        }
    }

    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }

    async showProfile() {
        const res = await axios.post('/api/addUserViews', {user_id : this.props.id});
        var notificationData = res.data;
        const ret = await axios.post('/api/notifications', notificationData);
        var notification_object_id = ret.data;
        if (ret.data) {
            const ret = await axios.post('/api/lastNotification', { "notification_object_id" : notification_object_id })
            var firstname = ret.data.firstname;
            var lastname = ret.data.lastname;
            var entity_type_id = ret.data.entity_type_id;
            var notifier_id = ret.data.notifier_id;
      
            var userList = this.props.socket.connectedUsers;
            var socketID = this.props.socket.socketID;
            var notifier_socketID;
        
            for(var i = 0; i < userList.length; i++) {
                if(userList[i].userID === notifier_id) {
                  notifier_socketID = userList[i].socketID;
                }
            }

            var isBlocked = false;
            var currentUser = this.props.currentUser[0].user_id;
            const ret1 = await axios.post('/api/blockedUsers', { "notifier_id" : notifier_id })
            if (ret1.data[0].usersBlockedByMe != null) {
                var blockedUsers = ret1.data[0].usersBlockedByMe.split(',');
                for (var j = 0; j < blockedUsers.length; j++) {
                    if (parseInt(blockedUsers[j]) === currentUser) {
                        isBlocked = true;
                    }
                }
            }

            if (notifier_socketID != null && !isBlocked) {
                if (entity_type_id === 4) {
                    var message = firstname + " " + lastname + " viewed your profile.";
                    this.props.sendNotification(notification_object_id, notifier_socketID, message);
                }
            }
        }
        this.props.history.push('/otherProfile/' + this.props.id);
    }

    async handleLike() {
        var data = { user_id : this.props.id}
        const res = await axios.post('/api/addLike', data);
        if (res.data) {
            if (res.data.action_type === "add like" || res.data.action_type === "match") {
                document.getElementById(this.props.id).style.color = "red";
            }
            else if (res.data.action_type === "delete like") {
                document.getElementById(this.props.id).style.color = "grey";
            }
            var notificationData = res.data;
            const ret = await axios.post('/api/notifications', notificationData);
            var notification_object_id = ret.data;
            if (ret.data) {
                const ret = await axios.post('/api/lastNotification', { "notification_object_id" : notification_object_id })
                var firstname = ret.data.firstname;
                var lastname = ret.data.lastname;
                var entity_type_id = ret.data.entity_type_id;
                var notifier_id = ret.data.notifier_id;
                
                var userList = this.props.socket.connectedUsers;
                var socketID = this.props.socket.socketID;
                var notifier_socketID;

                for(var i = 0; i < userList.length; i++) {
                    if(userList[i].userID === notifier_id) {
                    notifier_socketID = userList[i].socketID;
                    }
                }

                var isBlocked = false;
                var currentUser = this.props.currentUser[0].user_id;
                const ret1 = await axios.post('/api/blockedUsers', { "notifier_id" : notifier_id })
                if (ret1.data[0].usersBlockedByMe != null) {
                    var blockedUsers = ret1.data[0].usersBlockedByMe.split(',');
                    for (var j = 0; j < blockedUsers.length; j++) {
                        if (parseInt(blockedUsers[j]) === currentUser) {
                            isBlocked = true;
                        }
                    }
                }

                if (notifier_socketID != null && !isBlocked) {
                    if (entity_type_id === 1) {
                        var message = firstname + " " + lastname + " liked your profile."
                        this.props.sendNotification(notification_object_id, notifier_socketID, message);
                    } else if (entity_type_id === 2) {
                        var message = firstname + " " + lastname + " unliked your profile."
                        this.props.sendNotification(notification_object_id, notifier_socketID, message);
                    } else if (entity_type_id === 3) {
                        var message = firstname + " " + lastname + " matches with you."
                        this.props.sendNotification(notification_object_id, notifier_socketID, message);
                    }
                }
            }
        }
    }

    renderLike(id) {
        if (this.state.like) {
            return (
                <span id={id} className="icon" onClick={this.handleLike} style={{color: "red"}}>
                    <i className="fas fa-heart"></i>
                </span>
            )
        } else {
            return (
                <span id={id} className="icon" onClick={this.handleLike} style={{color: "grey"}}>
                    <i className="fas fa-heart"></i>
                </span>
            )
        }
    }

    renderUsers(id, firstname, lastname) {
        if (this.props.socket != null) {
            var userList = this.props.socket.connectedUsers;
            for(var i = 0; i < userList.length; i++) {
                if(userList[i].userID === id) {
                    return (
                        <span>
                            <i className="fas fa-circle" style={{color: "green"}}></i> {firstname} {lastname}
                        </span>
                    )
                } else{
                    return (
                        <span>
                            <i className="fas fa-circle" style={{color: "white"}}></i> {firstname} {lastname}
                        </span>
                    )      
                }
            }
        }
    }


    render() {
        const { id, firstname, lastname, age, src } = this.props;
        var getAge = require('get-age');
        if (src) {
			if (src.includes("cloudinary")) {
				var path = src;
			} else {
				var path = 'http://localhost:8080/' + src;
            }
        }

        return (
                <div className="cardProfile">
                    <div className="card-image">
                        <figure className="image is-3by2">
                        <LazyLoad height={50}>
                            <img className="imageCard" src={path} alt=""/>
                        </LazyLoad>
                        </figure>
                        <div className="card-content is-overlay is-clipped">
                        <div className="columns">
                            <div className="homepageInfo">
                                {this.renderUsers(id, firstname, lastname)}
                            </div>
                        </div>
                        <div className="columns">
                            <div className="homepageInfo">
                                {getAge(age)}
                            </div> 
                        </div>        
                        </div>
                    </div>
                    <div>
                        <div className="card-footer-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <a className="button is-rounded round-button buttonLike">
                                        <span className="icon" onClick={this.showProfile}>
                                            <i className="fa fa-star"></i>
                                        </span>
                                    </a>
                                </p>
                                <p className="control">
                                    <a className="button is-rounded round-button buttonLike">
                                        {this.renderLike(id)}
                                    </a>
                                </p>
                                {/* <p className="control">
                                    <a className="button is-rounded round-button buttonLike">
                                        <span className="icon">
                                            <i className="fas fa-circle"></i>
                                        </span>
                                    </a>
                                </p> */}
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth.currentUser,
	    socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		  sendNotification: sendNotification
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));

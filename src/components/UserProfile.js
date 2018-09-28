import React, { Component } from 'react';
import axios from 'axios';

class UserProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMounted: false,
            like : false
        }
        this.showProfile = this.showProfile.bind(this)
        this.handleLike = this.handleLike.bind(this)
    }

    componentDidMount() {
        this.setState({ isMounted: true }, () => {
            axios.get('/api/searchLikeProfileUser').then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].to_user_id === this.props.id) {
                        if (this.state.isMounted) {
                            this.setState({like : true})
                        }
                    }
                }
            })
            .catch(function (error) {
                this.setState({like : false})
            });
        });
      }

    componentWillUnmount() {
        this.setState({ isMounted: false });
    }

    async showProfile() {
        const res = await axios.post('/api/addUserViews', {user_id : this.props.id});
        this.props.history.push('/otherProfile/' + this.props.id);
    }

    async handleLike() {
        const { socket } = this.props;
        var data = { user_id : this.props.id}
        const res = await axios.post('/api/addLike', data);
        if (res.data) {
            if (res.data.action_type === "add like") {
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
                var notifier_id = ret.data;
                
                for(var i = 0; i < userList.length; i++) {
                    if(userList[i].userID === notifier_id) {
                      window.selectedUser = userList[i].socketID;
                    }
                }

                if (window.selectedUser != null) {
                socket.emit('new_notification', {
                    notifier_id : window.selectedUser
                });
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
                            <img className="imageCard" src={path} alt=""/>
                        </figure>
                        <div className="card-content is-overlay is-clipped">
                        <div className="columns">
                            <div className="homepageInfo">
                                {firstname} {lastname}
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
                                <p className="control">
                                    <a className="button is-rounded round-button buttonLike">
                                        <span className="icon">
                                            <i className="fas fa-comment"></i>
                                        </span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default UserProfile;
import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import CarouselContainer from './CarouselContainer';
import { sendNotification } from '../actions/actionNotifications';

class UserProfileContainer extends Component {

	constructor(props) {
		super(props);
        this.state = {
            blocked : "",
            reported : "",
            isMounted: false,
            like: false
        }
        this.signal = axios.CancelToken.source();
        this.handleReport = this.handleReport.bind(this);
        this.handleBlock = this.handleBlock.bind(this);
        this.handleLike = this.handleLike.bind(this);
    }
    
    async componentDidMount() {
        try {
            var user_id = this.props.id;
            console.log(user_id)
            const res1 = await axios.get('/api/showBlockProfile/?user_id=' + user_id, { cancelToken: this.signal.token });
            const res2 = await axios.get('/api/showReportProfile/?user_id=' + user_id, { cancelToken: this.signal.token });
            var block_status = res1.data;
            var report_status = res2.data;
            if (block_status === "blocked") {
                this.setState({ blocked: true });
            } else if (block_status === "unblocked") {
                this.setState({ blocked: false });
            }
            if (report_status === "reported") {
                this.setState({ reported: true });  
            } else if (report_status === "unreported") {
                this.setState({ reported: false });
            }
            const res3 = await axios.get('/api/searchLikeProfileUser', { cancelToken: this.signal.token });
            for (var i = 0; i < res3.data.length; i++) {
                if (res3.data[i].to_user_id === this.props.id) {
                    this.setState({like : true})
                }
            }

            const res4 = await axios.get('/api/findLike/?user_id=' + user_id, { cancelToken: this.signal.token })
            if (res4.data === true) {
                document.getElementById(this.props.id).style.color = "red";
            }
            else {
                document.getElementById(this.props.id).style.color = "grey";
            }
        } catch (err) {
            if (axios.isCancel(err)) {
            //   console.log(err.message);
            }
        }


    }

    componentWillUnmount() {
        this.signal.cancel('Api is being canceled');
    }

    showTitle() {
        var getAge = require('get-age')
        if (this.props.user.gender === "man") {
            return (
                <p className="title is-4">♂ {this.props.user.firstname} {this.props.user.lastname}, {getAge(this.props.user.birth_date)}</p>
            )
        } else {
            return (
                <p className="title is-4">♀ {this.props.user.firstname} {this.props.user.lastname}, {getAge(this.props.user.birth_date)}</p>
            )    
        }
    }

    showInterests() {
        return this.props.tags.map(tag => {
            const uuidv4 = require('uuid/v4');
            var id = uuidv4();
            return (
              <span key={id}>#{tag.name}</span>
            );
        })
    }

    showLastVisit() {
        var date = moment(this.props.user.last_login).utc().format('MMMM Do YYYY, h:mm:ss a');
        var end = moment(new Date()).utc().format('MMMM Do YYYY, h:mm:ss a');
 
        var a = moment(this.props.user.last_login).utc();
        var b = moment(new Date()).utc();
        var diff = b.diff(a, 'minutes');
        if (diff < 5) {
            return (
                'Connected'
            )
        }
        return (
            'Last visit:' + ' ' + date
        );
    }

    showOptions() {
        if (this.props.id === undefined || this.props.id === null || this.props.id === '') {
            return;
        }
        if (this.state.blocked != null && this.state.reported != null) {
            if (this.state.blocked && this.state.reported) {
                return (
                    <div className="field is-grouped">
                        <p className="control">
                            <a className="button is-link" disabled>
                            Reported
                            </a>
                        </p>
                        <p className="control">
                            <a className="button" onClick={this.handleBlock}>
                            Unblock
                            </a>
                        </p>
                    </div>
                )
            } else if (this.state.blocked && !this.state.reported) {
                return (
                    <div className="field is-grouped">
                        <p className="control">
                            <a className="button is-link" onClick={this.handleReport}>
                            Report
                            </a>
                        </p>
                        <p className="control">
                            <a className="button" onClick={this.handleBlock}>
                            Unblock
                            </a>
                        </p>
                    </div>
                )  
            } else if (!this.state.blocked && this.state.reported) {
                return (
                    <div className="field is-grouped">
                        <p className="control">
                            <a className="button is-link" disabled>
                            Reported
                            </a>
                        </p>
                        <p className="control">
                            <a className="button" onClick={this.handleBlock}>
                            Block
                            </a>
                        </p>
                    </div>
                )    
            } else if (!this.state.blocked && !this.state.reported) {
                return (
                    <div className="field is-grouped">
                    <p className="control">
                        <a className="button is-link" onClick={this.handleReport}>
                        Report
                        </a>
                    </p>
                    <p className="control">
                        <a className="button" onClick={this.handleBlock}>
                        Block
                        </a>
                    </p>
                </div>
                )         
            }
        }
    }

    async handleReport() {
        var user_id = this.props.id;
        const res = await axios.post('/api/reportProfile/?user_id=' + user_id);
        if (res.data === "reported") {
            this.setState({ reported: true });  
        }
    }

    async handleBlock() {
        var user_id = this.props.id;
        const res = await axios.post('/api/blockProfile/?user_id=' + user_id);
        if (res.data === "blocked") {
            this.setState({ blocked: true });  
        } else if (res.data === "unblocked") {
            this.setState({ blocked: false })
        }
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

    showLike(id) {
        if(this.props.history.location.pathname === '/otherProfile/' + id) {
            return (
                <a className="button is-rounded round-button buttonLike">
                    {this.renderLike(id)}
                </a>
            )
        } else {
            return
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

    render () {
        return (
        <div className="container is-fluid">
                <div className="header">
                    <div className="media">
                        <div className="media-content labelProfile">
                            {this.showTitle()}
                            <p className="subtitle is-6 labelProfile">@{this.props.user.username}</p>
                        </div>
                    </div>
                </div>
                <div className="card-image">
                    <CarouselContainer
                        user={this.props.user}
                        photos={this.props.photos}
                    />
                </div>
                <div className="control">
                    {this.showLike(this.props.id)}
                </div>
                <div className="card-content">
                    <div className="content">
                        <div className="field">
                            <label className="label labelProfile">Bio</label>
                            <div className="control">
                                {this.props.user.bio}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label labelProfile">Occupation</label>
                            <div className="control">
                                I work as a "{this.props.user.occupation}"
                            </div>
                        </div>  
                        <div className="field">
                            <label className="label labelProfile">I'm interested in</label>
                            <div className="control">
                                {this.props.interest[0].name}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label labelProfile">I'm looking for</label>
                            <div className="control">
                                {this.props.relationship[0].name}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label labelProfile">Interests</label>
                            <div className="control">
                                {this.showInterests()}
                            </div>
                        </div>  
                        <div className="field">
                            <label className="label labelProfile">Popularity</label>
                            <div className="control">
                                {this.props.user.popularity}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label labelProfile">Status</label>
                            <div className="control">
                                {this.showLastVisit()}
                            </div>
                        </div>                    
                    </div>
                </div>
                <div>
                    {this.showOptions()}
                </div>
        </div>
    )};
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth.currentUser,
        socket: state.socket
    }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		  sendNotification: sendNotification
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfileContainer));
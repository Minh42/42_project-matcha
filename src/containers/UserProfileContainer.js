import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import CarouselContainer from './CarouselContainer';

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
        } catch (err) {
            if (axios.isCancel(err)) {
              console.log(err.message); // => prints: Api is being canceled
            }
        }

        this.setState({ isMounted: true }, () => {
            axios.get('/api/searchLikeProfileUser').then(res => {
                for (var i = 0; i < res.data.length; i++) {
                    if (parseInt(res.data[i].to_user_id) === parseInt(this.props.id)) {
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
        console.log(this.props.id)
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
		currentUser: state.auth.currentUser
    }
}

export default withRouter(connect(mapStateToProps, null)(UserProfileContainer));
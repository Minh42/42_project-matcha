import React, { Component } from 'react';
import { withRouter } from 'react-router';
import axios from 'axios';

class UserProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            icon : ""
        }
        this.showProfile = this.showProfile.bind(this)
        this.handleLike = this.handleLike.bind(this)
    }

    async componentDidMount() {
        const user_like = this.props.id
        const res = await axios.post('/api/searchLikeProfileUser')
        var i = 0;
        while (i < res.data.length) {
            if (res.data[i].to_user_id === user_like) {
                this.setState ({
                    icon: this.props.id
                })
                document.getElementById(this.props.id).style.color = "red";
            }
            i++;
        }
    }

    showProfile() {
        const user_id = this.props.id
        this.props.history.push('/profileOtherUser/' + user_id);
    }

    async handleLike() {
        var data = { user_id : this.props.id}
        const res = await axios.post('/api/addLike', data)
        if (res.data === "add") {
            this.setState ({
                icon: this.props.id
            })
            document.getElementById(this.props.id).style.color = "red";
        }
        else if (res.data === "delete") {
            this.setState ({
                icon: this.props.id
            })
            document.getElementById(this.props.id).style.color = "grey";
        }
    }

    render() {
        const { user, age, src } = this.props;
        return (
            // <div className="column ">
                <div className="cardProfile">
                    <div className="card-image">
                        <figure className="image is-3by2">
                            <img className="imageCard" src={src} alt=""/>
                        </figure>
                        <div className="card-content is-overlay is-clipped">
                        {/* <input id="hiddenID" type="hidden">{id}</input> */}
                        <div className="columns">
                            <div className="homepageInfo">
                                {user}
                            </div>
                        </div>
                        <div className="columns">
                            <div className="homepageInfo">
                                {age}
                            </div> 
                        </div>        
                        </div>
                    </div>
                    {/* <footer className="card-footer"> */}
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
                                        <span id={this.state.icon} className="icon" onClick={this.handleLike}>
                                            <i className="fas fa-heart"></i>
                                        </span>
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
                    {/* </footer> */}
                </div>
            // </div>
        )
    }
}

export default withRouter(UserProfile);
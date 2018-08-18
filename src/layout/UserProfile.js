import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import axios from 'axios';

import EditUserProfileContainer from '../containers/EditUserProfileContainer';
import UserProfileContainer from '../containers/UserProfileContainer';

class UserProfile extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			isEditingPersonnalInfo: false,
			isEditingOtherInfo: false,
			isEditingProfilePicture: false,

			// user: null,
			// userPhotos: null,
			// userTags: null
		};
		this.toggleEditPersonnalInfo = this.toggleEditPersonnalInfo.bind(this);
		this.toggleEditOtherInfo = this.toggleEditOtherInfo.bind(this);
		this.toggleEditProfilePicture =this.toggleEditProfilePicture.bind(this);
	}

    componentDidMount() {
		console.log(this.state.data)
        // const res = await axios.get('/api/profile');
        // this.setState({user: res.data.infos, userPhotos: res.data.photos, userTags: res.data.tags});
	}

	toggleEditPersonnalInfo() {
		this.setState({
			isEditingPersonnalInfo: !this.state.isEditingPersonnalInfo,
			isEditingOtherInfo: false,
			isEditingProfilePicture: false
		})
	}

	toggleEditOtherInfo() {
		this.setState({
			isEditingOtherInfo: !this.state.isEditingOtherInfo,
			isEditingPersonnalInfo: false,
			isEditingProfilePicture: false
		})
	}

	toggleEditProfilePicture() {
		this.setState({
			isEditingProfilePicture: !this.state.isEditingProfilePicture,
			isEditingPersonnalInfo: false,
			isEditingOtherInfo: false,
		})
	}

	showEditFeature() {
		if (this.state.isEditingPersonnalInfo) {
			return (
				<EditUserProfileContainer />
			)
		}
		else if (this.state.isEditingOtherInfo) {
			return (
				<h1>hello other Info</h1>
			)
		}
		else if (this.state.isEditingProfilePicture) {
			return (
				<h1>hello Profile picture</h1>
			)
		}
		else if ((this.state.isEditingPersonnalInfo === false) && (this.state.isEditingOtherInfo === false) && (this.state.isEditingProfilePicture === false)) {
			return (
				<UserProfileContainer />
			)
		}
	}

	render () {
		return (
		<div className="columns" id="mail-app">
			<aside className="column is-2 aside">
				<div className="compose">
					<div>
						<button className="button buttonProfile" onClick={this.toggleEditPersonnalInfo}>Edit personnal infos</button>
					</div>
					<br></br>
					<div>
						<button className="button buttonProfile" onClick={this.toggleEditOtherInfo}>Edit Other infos</button>
					</div>
					<br></br>
					<div>
						<button className="button buttonProfile" onClick={this.toggleEditProfilePicture}>Edit profile picture</button>
					</div>
				</div>
			</aside>
			<div className="column is-4 messages" id="message-feed">
				Hello
			</div>
			<div className="column is-6 message" id="message-pane">
				{this.showEditFeature()}
			</div>
		</div>
	)};
}

function mapStateToProps(state) {
	console.log(state)
    return { 
		errorMessage: state.auth.error,
		selectedUser: state.selectedUser
    };
}

export default connect(mapStateToProps, null)(UserProfile);
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
		};
		this.toggleEditProfilePicture =this.toggleEditProfilePicture.bind(this);
		this.toggleEditPersonnalInfo = this.toggleEditPersonnalInfo.bind(this);
		this.toggleEditOtherInfo = this.toggleEditOtherInfo.bind(this);
		this.toggleBack =this.toggleBack.bind(this);
	}

	toggleEditPersonnalInfo() {
		this.setState({
			isEditingPersonnalInfo: !this.state.isEditingPersonnalInfo
		})
	}

	toggleEditOtherInfo() {
		this.setState({
			isEditingOtherInfo: !this.state.isEditingOtherInfo
		})
	}

	toggleEditProfilePicture() {
		this.setState({
			isEditingProfilePicture: !this.state.isEditingProfilePicture
		})
	}

	toggleBack() {
		this.setState({
			isEditingProfilePicture: false,
			isEditingPersonnalInfo: false,
			isEditingOtherInfo: false
		})
	}

	showEditFeature() {
		console.log(this.props.selectedUser)
		if (this.props.selectedUser) {
			if (this.state.isEditingPersonnalInfo) {
				return (
					<EditUserProfileContainer 
						user={this.props.selectedUser.data.infos}
					/>
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
			else if ((!this.state.isEditingPersonnalInfo) && (!this.state.isEditingOtherInfo) && (!this.state.isEditingProfilePicture)) {
				return (
					<UserProfileContainer
						user={this.props.selectedUser.data.infos}
						photos={this.props.selectedUser.data.photos}
						tags={this.props.selectedUser.data.tags}
					/>
				)
			}
		}
	}

	showEditButtons() {
		if ((this.state.isEditingPersonnalInfo) || (this.state.isEditingOtherInfo) || (this.state.isEditingProfilePicture)) {
			return (
				<div>
					<button className="button buttonProfile" onClick={this.toggleBack}>Back</button>
				</div>
			)
		} else {
			return (
				<div>
					<div>
						<button className="button buttonProfile" onClick={this.toggleEditProfilePicture}>Edit profile picture</button>
					</div>
					<br></br>
					<div>
						<button className="button buttonProfile" onClick={this.toggleEditPersonnalInfo}>Edit personnal infos</button>
					</div>
					<br></br>
					<div>
						<button className="button buttonProfile" onClick={this.toggleEditOtherInfo}>Edit other infos</button>
					</div>
					<br></br>
				</div>
			)
		}
	}

	render () {
		return (
		<div className="columns" id="mail-app">
			<aside className="column is-2 aside">
				<div className="compose">
					{this.showEditButtons()}
				</div>
			</aside>
			<div className="column is-4 messages hero is-fullheight" id="message-feed">
				Hello
			</div>
			<div className="column is-6 message hero is-fullheight" id="message-pane">
				{this.showEditFeature()}
			</div>
		</div>
	)};
}

function mapStateToProps(state) {
    return { 
		errorMessage: state.auth.error,
		selectedUser: state.selectedUser
    };
}

export default connect(mapStateToProps, null)(UserProfile);
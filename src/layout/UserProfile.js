import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import izitoast from 'izitoast';
import EditUserProfileContainer from '../containers/EditUserProfileContainer';
import EditUserOtherInfoContainer from '../containers/EditUserOtherInfoContainer';
import UserProfileContainer from '../containers/UserProfileContainer';
import FilesUploadContainer from '../components/FilesUploadContainer';
import LikesViewsContainer from '../containers/LikesViewsContainer';

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

	async componentDidMount() {
		const res = await axios.get('/api/profile');
		this.props.selectUser(res);
	}

	componentDidUpdate() {
		console.log(this.props.socket)
		if (this.props.socket.message != null) {
			izitoast.show({
				message: this.props.socket.message,
				position: 'topRight'
			});
		}
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

	async toggleBack() {
		const ret = await axios.post('/api/searchTags');
		if (ret.data === true) {
			const ret = await axios.get('/api/profile')
			this.props.selectUser(ret);
			this.setState({
			isEditingProfilePicture: false,
			isEditingPersonnalInfo: false,
			isEditingOtherInfo: false
			})	
		} else {
			iziToast.show({
				title: 'warning',
				message: 'Please add at least one tag',
				position: 'topRight'
			});
		}
	}

	showEditFeature() {
		if(this.props.selectedUser) {
			if (this.state.isEditingPersonnalInfo) {
				return (
					<EditUserProfileContainer 
						user={this.props.selectedUser.data.infos}
					/>
				)
			}
			else if (this.state.isEditingOtherInfo) {
				return (
					<EditUserOtherInfoContainer
						user={this.props.selectedUser.data}				
					/>
				)
			}
			else if (this.state.isEditingProfilePicture) {
				return (
					<FilesUploadContainer
						user={this.props.selectedUser.data.infos}
					/>
				)
			}
			else if ((!this.state.isEditingPersonnalInfo) && (!this.state.isEditingOtherInfo) && (!this.state.isEditingProfilePicture)) {
				return (
					<UserProfileContainer 
						user={this.props.selectedUser.data.infos}	
						photos={this.props.selectedUser.data.photos}
						tags={this.props.selectedUser.data.tags}
						interest={this.props.selectedUser.data.interest}
						relationship={this.props.selectedUser.data.relationship}	
					/>
				)
			}
		}
	}

	showEditButtons() {
		if ((this.state.isEditingPersonnalInfo) || (this.state.isEditingOtherInfo) || (this.state.isEditingProfilePicture)) {
			return (
				<div>
					<a type="button" className="button is-small is-fullwidth buttonProfile" onClick={this.toggleBack}>Back</a>
				</div>
			)
		} else {
			return (
				<div>
					<div>
						<a className="button is-small is-fullwidth buttonProfile" onClick={this.toggleEditProfilePicture}>Edit profile picture</a>
					</div>
					<br></br>
					<div>
						<a className="button is-small is-fullwidth buttonProfile" onClick={this.toggleEditPersonnalInfo}>Edit personnal infos</a>
					</div>
					<br></br>
					<div>
						<a className="button is-small is-fullwidth buttonProfile" onClick={this.toggleEditOtherInfo}>Edit other infos</a>
					</div>
				</div>
			)
		}
	}

	render () {
		return (
		<div className="columns" id="mail-app">
			<aside className="column is-2 aside backgroundInfoUser">
				<div className="column">
					{this.showEditButtons()}
				</div>
			</aside>
			<div className="column is-3 messages hero is-fullheight" id="message-feed">
				<LikesViewsContainer />
			</div>
			<div className="column is-7 message hero is-fullheight" id="message-pane">
				{this.showEditFeature()}
			</div>
		</div>
	)};
}

function mapStateToProps(state) {
    return { 
		selectedUser: state.selectedUser,
		socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        selectUser: selectUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
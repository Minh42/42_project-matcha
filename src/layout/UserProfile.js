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
			isEditing: false,
			// user: null,
			// userPhotos: null,
			// userTags: null
		};
		this.toggleEdit = this.toggleEdit.bind(this);
	}

    componentDidMount() {
		console.log(this.state.data)
        // const res = await axios.get('/api/profile');
        // this.setState({user: res.data.infos, userPhotos: res.data.photos, userTags: res.data.tags});
	}

	toggleEdit() {
		this.setState({isEditing: !this.state.isEditing})
	}

	showEditFeature() {
		if (this.state.isEditing) {
			return (
				<EditUserProfileContainer />
			)
		} else {
			return (
				<UserProfileContainer />
			)
		}
	}

	render () {
		return (
		<div className="columns" id="mail-app">
			<aside className="column is-2 aside hero is-fullheight">
				<div className="compose has-text-centered">
                    <a className="button is-danger is-block is-bold">
						<span className="compose" onClick={this.toggleEdit}>Edit profile</span>
					</a>
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
	console.log(state)
    return { 
		errorMessage: state.auth.error,
		selectedUser: state.selectedUser
    };
}

export default connect(mapStateToProps, null)(UserProfile);
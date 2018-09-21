import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

import UserProfileContainer from '../containers/UserProfileContainer';

class ProfileOtherUser extends Component {

	async componentDidMount() {
		var user_id = this.props.match.params.id;
		const res = await axios.get('/api/otherProfile/?user_id=' + user_id);
		this.props.selectUser({data: res.data});
	}

	renderProfile() {
		var user_id = this.props.match.params.id;
		if (this.props.selectedUser) {
			return (
				<UserProfileContainer 
					id={user_id}
					user={this.props.selectedUser.data.infos}	
					photos={this.props.selectedUser.data.photos}
					tags={this.props.selectedUser.data.tags}
					interest={this.props.selectedUser.data.interest}
					relationship={this.props.selectedUser.data.relationship}	
				/>
			)
		}
	}
 
	render () {
		return (
		<div className="columns background">
			<div className="column is-6 is-offset-3 message hero is-fullheight" id="message-pane">
				{this.renderProfile()}
			</div>
		</div>
	)};
}

function mapStateToProps(state) {
    return { 
		selectedUser: state.selectedUser
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        selectUser: selectUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileOtherUser);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

import UserProfileContainer from '../containers/UserProfileContainer';

class ProfileOtherUser extends Component {

	async componentDidMount() {
		console.log('here')
		const user_id = this.props.match.params.id
		console.log(user_id)
		const res = await axios.get('/api/otherProfile/?user_id=' + user_id);
        this.props.selectUser(res);
	}

	render () {
		return (
		<div className="columns background">
			<div className="column is-6 is-offset-3 message hero is-fullheight" id="message-pane">
				<UserProfileContainer 
					user={this.props.selectedUser.data.infos}	
					photos={this.props.selectedUser.data.photos}
					tags={this.props.selectedUser.data.tags}
					interest={this.props.selectedUser.data.interest}
					relationship={this.props.selectedUser.data.relationship}	
				/>
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

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        selectUser: selectUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileOtherUser);
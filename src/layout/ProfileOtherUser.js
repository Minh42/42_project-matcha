import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import izitoast from 'izitoast';
import { withRouter } from 'react-router-dom';

import UserProfileContainer from '../containers/UserProfileContainer';

class ProfileOtherUser extends Component {
    constructor(props) {    
		super(props);
		this.state = {
			isUpdated: false,
		};
	}
	
	async componentDidMount() {
		var user_id = this.props.match.params.id;
		const res = await axios.get('/api/otherProfile/?user_id=' + user_id);
		if (res.data === "error") {
			this.props.history.push('/homepage');
		} else {
			this.props.selectUser({data: res.data});
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.socket != null && this.props.socket != null) {
			if (prevProps.socket.message != this.props.socket.message) {
				if (this.props.socket != null && !this.state.isUpdated) {
					if (this.props.socket.message != null) {
						izitoast.show({
							message: this.props.socket.message,
							position: 'topRight'
						});
					}
				}
			}
		}
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
		selectedUser: state.selectedUser,
		socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        selectUser: selectUser
    }, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileOtherUser));
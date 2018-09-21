import React, { Component } from 'react';
import axios from 'axios';
import getAge from 'get-age';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { profileConversationAction } from '../actions/actionConversation';
import { profileTchatAction } from '../actions/actionOpenTchat';
import { getConversationProfileUser} from '../selectors/index';

class Conversation extends Component {

	constructor(props) {
		super(props)

		this.openTchat = this.openTchat.bind(this);
	}

	async componentDidMount() {
		var res = await axios.post('/api/findAllConversation')
		this.props.profileConversationAction(res.data)
	}

	openTchat(user_id) {
		console.log(user_id)
		this.props.profileTchatAction(user_id)
	}

	render() {
		console.log("ALL CONVERSATION:", this.props.matchConversation)
		if (this.props.matchConversation != undefined) {
			return this.props.matchConversation.map((user) => {
				return (
					<div key={user.user_id} className="tchatRoom columns" onClick={() => this.openTchat(user.user_id)}>
						<div className="column is-4 is-offset-1">
							<figure>
								<img className="size_image" src={user.imageProfile_path} height="20px"/>
							</figure>
						</div>
						<div className="column is-4">
							<p>{user.firstname} {user.lastname}, {getAge(user.birth_date)}</p>
						</div>
					</div>
				)
			})
		}
		else {
			return (
				<p>no conversation</p>
			)
		}
	}
}

function mapStateToProps(state) {
    return {
		matchConversation : getConversationProfileUser(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		profileConversationAction : profileConversationAction,
		profileTchatAction : profileTchatAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
import React, { Component } from 'react';
import axios from 'axios';
import getAge from 'get-age';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { profileLikesAction } from '../actions/actionMatch';
import { profileConversationAction } from '../actions/actionConversation';
import { getMatchProfile } from '../selectors/index';
import {checkUserConversation} from '../../library/searchFunctions';

class Match extends Component {

	constructor(props) {
		super(props)

		this.openConversation = this.openConversation.bind(this);
	}

	async componentDidMount() {
		const res = await axios.get('/api/searchLikeProfileUser') // personne que l'on a liké
		console.log(res.data)
		this.props.profileLikesAction(res.data);
	}

	async openConversation(user_match) {
		console.log(this.props.conversationUserID)
		var id_user = { id_user_match : user_match}
			if (checkUserConversation(this.props.conversationUserID, id_user) === true) { }
			else {
				const res = await axios.post('/api/createConversationParticipant', id_user)
				var allConversation = await axios.post('/api/findAllConversation')
				this.props.profileConversationAction(allConversation.data)
			}
	}

	render() {
		if (this.props.matchProfile != undefined) {
			return this.props.matchProfile.map((user) => {
				return (
					<div key={user.user_id} className="columns">
						<div className="column is-4 is-offset-1">
							<figure onClick={() => this.openConversation(user.user_id)}>
								<img className="size_image" src={user.imageProfile_path} height="20px"/>
							</figure>
						</div>
						<div className="column is-6 ">
							<p>{user.firstname} {user.lastname}, {getAge(user.birth_date)}</p>
						</div>
						<div className="column is-4 is-offset-1">
							
						</div>
					</div>
				)
			})
		} else {
			return (
				<div className="columns">
					<div className="column is-10 is-offset-1">
						No match
					</div>
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
    return {
		matchConversation : state.profileConversation,
		conversationUserID : state.profileConversation,
		matchProfile : getMatchProfile(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		profileConversationAction : profileConversationAction,
		profileLikesAction : profileLikesAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Match);
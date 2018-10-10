import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { joinRoom, showConversation } from '../actions/actionConversations';
import ConversationComponent from '../components/ConversationComponent';

class Conversation extends Component {
	constructor(props) {
		super(props);
		this.openTchat = this.openTchat.bind(this);
	}

	openTchat(conversation) {
		this.props.joinRoom(conversation.conversation_id);
		this.props.showConversation(conversation.conversation_id);
	}

	renderConversation() {
		if (this.props.chat != null) {
			if(this.props.chat.conversations_list != null) {
				return this.props.chat.conversations_list.map((conversation) => {
						return (
							<ConversationComponent
								key={conversation.conversation_id}
								firstname={conversation.firstname}
								lastname={conversation.lastname}
								src={conversation.profilePicture}
								message="Write a new message"
								onClick={() => this.openTchat(conversation)}
							/>
						);
				});
			}
		} else {
			return (
				<p>No conversation</p>
			)
		}
	}


	
	render() {
		return (
			<div>
				{this.renderConversation()}
			</div>
		)
	}
}

function mapStateToProps(state) {
    return { 
		currentUser: state.auth.currentUser,
		socket: state.socket,
		chat: state.conversations,
		convers : state.convers
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		joinRoom: joinRoom,
		showConversation: showConversation
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
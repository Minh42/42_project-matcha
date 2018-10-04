import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MessageComponent from '../components/MessageComponent';
import { requestMessages, showConversation } from '../actions/actionConversations';

class TchatMessagesComponent extends Component {

	constructor(props) {
		super(props);
	}

	renderMessages() {	
		var conversation_id = this.props.socket.conversation;
		var conversations = this.props.chat.conversations;
		for (var i = 0; i < conversations.length; i++) {
			if (conversations[i].conversation_id === conversation_id) {
				const messages = conversations[i].messages.map((message, i) => {
					return (
						<MessageComponent
							key={i}
							firstname={message.firstname}
							lastname={message.lastname}
							message={message.message}
							from={message.participant_id}
						/>
					)
				});
				return (
					<div className='messages' id='messageList'>
					{ messages }
					</div>
				)
			}
		}
	}

	render() {
		return (
			<div className="column is-12">
				{this.renderMessages()}
			</div>	
		)
	}

}

function mapStateToProps(state) {
    return { 
		currentUser: state.auth.currentUser,
		socket: state.socket,
		chat: state.conversations
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		requestMessages: requestMessages,
		showConversation: showConversation
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TchatMessagesComponent);
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestMessages, requestConversations, joinRoom, showConversation } from '../actions/actionConversations';
import ConversationComponent from '../components/ConversationComponent';

class Conversation extends Component {
	constructor(props) {
		super(props);
		this.openTchat = this.openTchat.bind(this);
	}

	async componentDidMount() {
		var currentUser = this.props.currentUser[0].user_id;
		var userList = this.props.socket.connectedUsers;
		var notifier_socketID;

		for(var i = 0; i < userList.length; i++) {
			if(userList[i].userID === currentUser) {
			  notifier_socketID = userList[i].socketID;
			}
		}
		var res = await axios.post('/api/findAllConversations');
		this.props.requestConversations(res.data, currentUser, notifier_socketID);
		this.props.requestMessages(res.data, currentUser, notifier_socketID);
	}

	openTchat(conversation) {
		this.props.joinRoom(conversation.conversation_id);
		this.props.showConversation(conversation.conversation_id);
	}

	renderConversation() {
		if (this.props.chat != null) {
			if(this.props.chat.conversations_list != null) {
				return this.props.chat.conversations_list.map((conversation) => {
					if (conversation.messages.length > 0) {
						var len = conversation.messages.length;
						var message = 'write a message';
						// conversation.messages[len - 1].participant_id === this.props.currentUser[0].user_id ? 
						// message = 'Vous: ' + conversation.messages[len - 1].message : message = conversation.messages[len - 1].message;
						return (
							<ConversationComponent
								key={conversation.conversation_id}
								firstname={conversation.firstname}
								lastname={conversation.lastname}
								src={conversation.profilePicture}
								message={message}
								onClick={() => this.openTchat(conversation)}
							/>
						);
					} else {
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
					}
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
		showConversation: showConversation,
		requestMessages: requestMessages,
		requestConversations: requestConversations
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
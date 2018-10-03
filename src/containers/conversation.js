import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { joinSocket } from '../actions/actionNotifications';
import { requestMessages, joinRoom, showConversation } from '../actions/actionConversations';
import ConversationComponent from '../components/ConversationComponent';

class Conversation extends Component {
	constructor(props) {
		super(props);
		this.openTchat = this.openTchat.bind(this);
	}

	async componentDidMount() {
		this.props.joinSocket(this.props.currentUser[0].user_id);
		var currentUser = this.props.currentUser[0].user_id;
		var userList = this.props.socket.connectedUsers;
		var notifier_socketID;

		console.log(userList);

		for(var i = 0; i < userList.length; i++) {
			if(userList[i].userID === currentUser) {
			  notifier_socketID = userList[i].socketID;
			}
		}
		var res = await axios.post('/api/findAllConversations');
		console.log(notifier_socketID)
		this.props.requestMessages(res.data, currentUser, notifier_socketID);
	}

	openTchat(conversation) {
		this.props.joinRoom(conversation.conversation_id);
		this.props.showConversation(conversation);
	}

	renderConversation() {
		if (this.props.chat != null) {
			if(this.props.chat.conversations != null) {
				return this.props.chat.conversations.map((conversation) => {
					if (conversation.messages.length > 0) {
						var len = conversation.messages.length;
						var message;
						conversation.messages[len - 1].participant_id === this.props.currentUser[0].user_id ? 
						message = 'Vous: ' + conversation.messages[len - 1].message : message = conversation.messages[len - 1].message;
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
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		joinSocket: joinSocket,
		joinRoom: joinRoom,
		showConversation: showConversation,
		requestMessages: requestMessages
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestMessages, joinRoom, sendDirectMessage } from '../actions/actionConversations';
import ConversationComponent from '../components/ConversationComponent';
import { filterByProperty } from '../../library/searchFunctions';

class Conversation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
			messagesSent: '',
			messagesReceived: '',
			conversation_id: '',
			firstname: '',
			lastname: '',
			directMessage: ''
		};
		this.openTchat = this.openTchat.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this)
	}

	async componentDidMount() {
		var currentUser = this.props.currentUser[0].user_id;
		var userList = this.props.socket.connectedUsers;
		var socketID = this.props.socket.socketID;
		var notifier_socketID;

		for(var i = 0; i < userList.length; i++) {
			if(userList[i].userID === currentUser) {
			  notifier_socketID = userList[i].socketID;
			}
		}

		var res = await axios.post('/api/findAllConversations');
		this.props.requestMessages(res.data, currentUser, notifier_socketID);
	}

	handleChange (event) {
		this.setState({
		  directMessage: event.target.value
		})
	}

	handleSubmit(e) {
		e.preventDefault();
		var conversation_id = this.state.conversation_id;
		var participant_id = this.props.currentUser[0].user_id;
		var directMessage = this.state.directMessage;
		this.props.sendDirectMessage(conversation_id, participant_id, directMessage);
	}

	openTchat(conversation) {
		var currentUser = this.props.currentUser[0].user_id;
		var messagesSent = filterByProperty(conversation.messages, "participant_id", currentUser);
		var messagesReceived = filterByProperty(conversation.messages, "participant_id", conversation.user_id);
		this.setState ({
			open: true,
			messagesSent: messagesSent,
			messagesReceived: messagesReceived,
			conversation_id: conversation.conversation_id,
			firstname: conversation.firstname,
			lastname: conversation.lastname
		});
		this.props.joinRoom(conversation.conversation_id);
	}

	renderMessagesSent() {
		if (this.state.messagesSent != '') {
			return this.state.messagesSent.map((message, i) => {
				return (
					<p key={i}>
						{message.message}
					</p>
				)
			});
		}
	}

	renderMessagesReceived() {
		if (this.state.messagesReceived != '') {
			return this.state.messagesReceived.map((message, i) => {
				return (
					<p key={i}>
						{message.message}
					</p>
				)
			});
		}
	}

	renderConversation() {
		if (this.props.chat != null) {
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
		} else {
			return (
				<p>No conversation</p>
			)
		}
	}

	renderDirectMessage() {
		console.log(this.props.socket.directMessage);
	}

	renderTchat() {
		if (this.state.open) {
			return (
					<div className="TchatSection">
						<div className="HeadTchat">
							<p className="has-text-centered labelNameTchat">Conversation with {this.state.firstname} {this.state.lastname}</p>
						</div>
						<div className="columns BodyTchat">
							<div className="column is-5 is-offset-1 yourMessage">
								{this.renderMessagesSent()}
							</div>
							<div className="column is-5 is-offset-1 myMessage">
								{this.renderMessagesReceived()}
							</div>
						</div>
						<div>{this.renderDirectMessage()}</div>
						<div className="InputTchat">
							<form className="columns" onSubmit={this.handleSubmit}>
								<div className="input_msg_write column is-10">
								<input className="write_msg" type="text"  placeholder="type a message" value={this.state.directMessage} onChange={this.handleChange}/>
								{/* <input type="hidden" value={this.state.id = user[0].user_id}/> */}
								</div>
								<p className="column is-1">
									<button className="button msg_send_btn" type="submit" value="submit">Send</button>
								</p>
							</form>
						</div>
					</div>
				)
		} else {
			return (
				<div>
					No tchat open
				</div>
			)
		}
	}

	render() {
		return (
			<div className="columns blocChat">
				<div className="column is-4">
					{this.renderConversation()}
				</div>
				<div className="column is-8">
					{this.renderTchat()}
				</div>
			</div>
		)
	}
}

function mapStateToProps(state) {
    return {
		currentUser: state.auth.currentUser,
		chat: state.conversations,
		socket: state.socket
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		requestMessages: requestMessages,
		joinRoom: joinRoom,
		sendDirectMessage: sendDirectMessage
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
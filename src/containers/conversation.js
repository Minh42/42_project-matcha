import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestMessages, joinRoom, sendDirectMessage } from '../actions/actionConversations';
import { joinSocket } from '../actions/actionNotifications';
import MessageComponent from '../components/MessageComponent';
import ConversationComponent from '../components/ConversationComponent';

class Conversation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
			messages: '',
			conversation_id: '',
			firstname: '',
			lastname: '',
			input: ''
		};
		this.openTchat = this.openTchat.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	async componentDidMount() {
		this.props.joinSocket(this.props.currentUser[0].user_id);
		var currentUser = this.props.currentUser[0].user_id;
		var userList = this.props.socket.connectedUsers;
		var notifier_socketID;

		for(var i = 0; i < userList.length; i++) {
			if(userList[i].userID === currentUser) {
			  notifier_socketID = userList[i].socketID;
			}
		}

		var res = await axios.post('/api/findAllConversations');
		this.props.requestMessages(res.data, currentUser, notifier_socketID);
	}

	async componentDidUpdate() {
		const objDiv = document.getElementsByClassName('BodyTchat');
		objDiv.scrollTop = objDiv.scrollHeight;

		console.log(this.props.chat.directMessage);

		// if (this.props.chat != null) {
		// 	if (this.props.chat.directMessage != null) {
		// 		var message = { 
		// 			firstname: this.props.currentUser[0].firstname,
		// 			lastname: this.props.currentUser[0].lastname,
		// 			imageProfile_path: this.props.currentUser[0].imageProfile_path,
		// 			message: this.props.chat.directMessage,
		// 			participant_id: this.props.currentUser[0].user_id
		// 		}
		// 		this.addMessage(message);
		// 	}
		// }

	}

	handleChange (event) {
		this.setState({
		  input: event.target.value
		})
	}

	async handleSubmit(e) {
		e.preventDefault();
		var conversation_id = this.state.conversation_id;
		var participant_id = this.props.currentUser[0].user_id;
		var input = this.state.input;
		this.props.sendDirectMessage(conversation_id, participant_id, input);
		var message = { 
			firstname: this.props.currentUser[0].firstname,
			lastname: this.props.currentUser[0].lastname,
			imageProfile_path: this.props.currentUser[0].imageProfile_path,
			message: input,
			participant_id: this.props.currentUser[0].user_id
		}
		this.addMessage(message);

		// var currentUser = this.props.currentUser[0].user_id;
		// var userList = this.props.socket.connectedUsers;
		// var notifier_socketID;

		// for(var i = 0; i < userList.length; i++) {
		// 	if(userList[i].userID === currentUser) {
		// 	  notifier_socketID = userList[i].socketID;
		// 	}
		// }

		// var res = await axios.post('/api/findAllConversations');		
		// this.props.requestMessages(res.data, currentUser, notifier_socketID);
	}

	addMessage(message) {
		var messages = this.state.messages;
		console.log(messages)
		messages.push(message);
		console.log(messages)
		this.setState({ messages });
	}

	openTchat(conversation) {
		var messages = conversation.messages;
		this.setState ({
			open: true,
			messages: messages,
			conversation_id: conversation.conversation_id,
			firstname: conversation.firstname,
			lastname: conversation.lastname
		});
		this.props.joinRoom(conversation.conversation_id);
	}

	renderMessages() {
		if (this.state.messages != '') {
			console.log(this.state.messages);
			const messages = this.state.messages.map((message, i) => {
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


	renderTchat() {
		if (this.state.open) {
			return (
					<div className="TchatSection">
						<div className="HeadTchat">
							<p className="has-text-centered labelNameTchat">Conversation with {this.state.firstname} {this.state.lastname}</p>
						</div>
						<div className="columns BodyTchat">
							<div className="column is-12">
								{this.renderMessages()}
							</div>
					
						</div>
						<div className="InputTchat">
							<form className="columns chat-input" onSubmit={this.handleSubmit}>
								<div className="input_msg_write column is-10">
								<input className="write_msg" type="text"  placeholder="type a message" value={this.state.input} onChange={this.handleChange}/>
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
		sendDirectMessage: sendDirectMessage,
		joinSocket: joinSocket
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
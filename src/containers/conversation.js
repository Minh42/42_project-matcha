import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { requestMessages } from '../actions/actionConversations';
import ConversationComponent from '../components/ConversationComponent';
import Tchat from '../components/ConversationComponent';
import { filterByProperty } from '../../library/searchFunctions';

class Conversation extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
			messagesSent: '',
			messagesReceived: ''
		};
		this.openTchat = this.openTchat.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	async componentDidMount() {
		var currentUser = this.props.currentUser;
		var res = await axios.post('/api/findAllConversations');
		this.props.requestMessages(res.data, currentUser);
	}

	async handleSubmit() {
		var user_id = { user_id : this.state.id }
		var messageSend = { message : this.state.messageSend}
		const id_conversation = await axios.post('/api/findConversationID', user_id)
		socket.emit('subscribe', id_conversation.data[0])

		const res = await axios.post('/api/addMessageBDD', messageSend)
		if (res.data === 'success') {
			socket.emit('send', {room : id_conversation.data[0], message : this.state.messageSend, id : id_conversation});
			socket.on('message', function (message) {
				if (user_id.user_id === message.id.data[1]) {
					alert('Le serveur a un message pour vous : ' + message.message);
					const newDiv = document.createElement('div')
					newDiv.setAttribute("id", message.message + '1')
					const currentDiv = document.getElementById("parentMessageContainer"); 
					currentDiv.parentNode.insertBefore(newDiv, currentDiv);
					document.getElementById(message.message + '1').innerHTML = message.message;
				}
			})
			const newDiv = document.createElement('div')
			newDiv.setAttribute("id", this.state.messageSend + '1')
			const currentDiv = document.getElementById("parentMyMessContainer"); 
			currentDiv.parentNode.insertBefore(newDiv, currentDiv);
			document.getElementById(this.state.messageSend + '1').innerHTML = this.state.messageSend;
			this.setState({
				messageSend: ''
			})
			
		}
	}

	async openTchat(conversation) {
		var currentUser = this.props.currentUser[0].user_id;
		var messagesSent = filterByProperty(conversation.messages, "participant_id", currentUser);
		var messagesReceived = filterByProperty(conversation.messages, "participant_id", conversation.user_id);
		this.setState ({
			open: true,
			messagesSent: messagesSent,
			messagesReceived: messagesReceived
		});
		
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

	renderTchat() {
		if (this.state.open) {
			return (
					<div className="TchatSection">
						<div className="HeadTchat">
							<p className="has-text-centered labelNameTchat">Conversation</p>
						</div>
						<div className="columns BodyTchat">
							<div className="column is-5 is-offset-1 yourMessage">
								{this.renderMessagesSent()}
							</div>
							<div className="column is-5 is-offset-1 myMessage">
								{this.renderMessagesReceived()}
							</div>
						</div>
						<div className="InputTchat">
							<form className="columns" onSubmit={this.handleSubmit}>
								<div className="input_msg_write column is-10">
								<input className="write_msg" type="text"  placeholder="type a message" value={this.state.messageSend} onChange={this.onChange}/>
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
			<div className="columns">
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
		chat: state.conversations
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		requestMessages: requestMessages
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
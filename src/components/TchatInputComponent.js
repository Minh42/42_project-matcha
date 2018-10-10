import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendDirectMessage, requestConversations } from '../actions/actionConversations';
import { sendNotification } from '../actions/actionNotifications';
import axios from 'axios';

class TchatInputComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			input: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange (event) {
		this.setState({
		  input: event.target.value
		})
	}

	async handleSubmit(e) {
		e.preventDefault(); 
		var conversation_id = this.props.socket.conversation;
		var participant_id = this.props.currentUser[0].user_id;
		var input = this.state.input;
		var conversations = this.props.chat.conversations;
		
		var message = { 
			firstname: this.props.currentUser[0].firstname,
			lastname: this.props.currentUser[0].lastname,
			imageProfile_path: this.props.currentUser[0].imageProfile_path,
			participant_id: this.props.currentUser[0].user_id,
			message: input
		}

		console.log(conversations)
		for (var i = 0; i < conversations.length; i++) {
			if (conversations[i].conversation_id === conversation_id) {
				conversations[i].messages.push(message);
			}
		}

		this.props.sendDirectMessage(conversation_id, participant_id, input, conversations);

		const lst = await axios.post('/api/getLastParticipantID', {conversation_id: conversation_id});
		var notifier_id;
		participant_id === lst.data[0].user_id ? notifier_id = lst.data[1].user_id : notifier_id = lst.data[0].user_id;

		console.log(notifier_id)

		var notificationData = {
			action_type: "add message",
			entity_type_id: 5,
			entity_id: 6,
			actor_id: participant_id,
			notifier_id: notifier_id
		}
		// console.log(notificationData)
		const res = await axios.post('/api/notificationMessage', notificationData)
		// console.log(res.data)
		var notification_object_id = res.data;
		if (res.data) {
			const ret = await axios.post('/api/lastNotification', { "notification_object_id" : notification_object_id })
			var firstname = ret.data.firstname;
			var lastname = ret.data.lastname;
			var entity_type_id = ret.data.entity_type_id;
			var notifier_id = ret.data.notifier_id;
			
			var userList = this.props.socket.connectedUsers;
			var socketID = this.props.socket.socketID;
			var notifier_socketID;

			for(var i = 0; i < userList.length; i++) {
				if(userList[i].userID === notifier_id) {
				notifier_socketID = userList[i].socketID;
				}
			}

			if (notifier_socketID != null) {
				if (entity_type_id === 5) {
					var message = firstname + " " + lastname + " send you a message."
					this.props.sendNotification(notification_object_id, notifier_socketID, message);
				}
			}
		}
	}

	render() {
		return (
			<form className="columns chat-input" onSubmit={this.handleSubmit}>
				<div className="input_msg_write column is-10">
					<input className="write_msg" type="text"  placeholder="type a message" value={this.state.input} onChange={this.handleChange}/>
				</div>
				<p className="column is-1">
					<button className="button msg_send_btn" type="submit" value="submit">Send</button>
				</p>
			</form>
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
		sendDirectMessage: sendDirectMessage,
		requestConversations: requestConversations,
		sendNotification: sendNotification
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TchatInputComponent);
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

	async componentDidMount() {
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



		// console.log(this.props.socket.conversation)
		// if (this.props.socket.conversation != undefined) {
		// 	console.log('i came here')
		// 	var conversation = this.props.socket.conversation;
		// 	this.props.showConversation(conversation);
		// }

	}

	renderMessages() {
		console.log(this.props.socket.conversation)
		if (this.props.socket.conversation != undefined) {		
			console.log(this.props.socket.conversation.messages);
			const messages = this.props.socket.conversation.messages.map((message, i) => {
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
		socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		requestMessages: requestMessages,
		showConversation: showConversation
    }, dispatch);
}


export default connect(mapStateToProps, mapDispatchToProps)(TchatMessagesComponent);
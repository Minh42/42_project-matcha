import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TchatMessagesComponent from '../components/TchatMessagesComponent';
import TchatInputComponent from '../components/TchatInputComponent';
import { requestMessages, requestConversations } from '../actions/actionConversations';

class Tchat extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.socket.conversation = undefined;
	}

	renderTchat() {
		if (this.props.socket.conversation != undefined || this.props.chat != null) {
			var conversation_id = this.props.socket.conversation;
			var conversations = this.props.chat.conversations;
			if (conversation_id != undefined) {
				if (conversations != undefined) {
					for (var i = 0; i < conversations.length; i++) {
						if (conversations[i].conversation_id === conversation_id) {
							var firstname = conversations[i].firstname;
							var lastname = conversations[i].lastname;
						}
					}	
					return (
						<div className="TchatSection">
								<div className="HeadTchat">
									<p className="has-text-centered labelNameTchat">Conversation with {firstname} {lastname} </p>
								</div>
								<div className="columns BodyTchat" id="messageList">
									<TchatMessagesComponent />
								</div>
								<div className="InputTchat">
									<TchatInputComponent />
								</div>
							</div>
						);
				}
			} else {
			return (
				<div>Select a conversation</div>
			)
		}
	}	
}

	render() {
		return (
			<div>
				{this.renderTchat()}
			</div>
		)
	}
}

function mapStateToProps(state) {
    return { 
		currentUser: state.auth.currentUser,
		chat: state.conversations,
		socket: state.socket,
		chat: state.conversations
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		requestMessages: requestMessages,
		requestConversations: requestConversations
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Tchat)
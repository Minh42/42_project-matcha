import React, { Component } from 'react';
import { connect } from 'react-redux';
import TchatMessagesComponent from '../components/TchatMessagesComponent';
import TchatInputComponent from '../components/TchatInputComponent';

class Tchat extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		this.props.socket.conversation = undefined;
	}

	renderTchat() {
		if (this.props.socket.conversation != undefined) {
			var conversation_id = this.props.socket.conversation;
			var conversations = this.props.chat.conversations;

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
					<div className="columns BodyTchat">
						<TchatMessagesComponent />
					</div>
					<div className="InputTchat">
						<TchatInputComponent />
					</div>
				</div>
			);
		} else {
			return (
				<div>Select a conversation</div>
			)
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

export default connect(mapStateToProps, null)(Tchat)
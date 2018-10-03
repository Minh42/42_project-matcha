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
			var firstname = this.props.socket.conversation.firstname;
			var lastname = this.props.socket.conversation.lastname;
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
		socket: state.socket
    };
}

export default connect(mapStateToProps, null)(Tchat)
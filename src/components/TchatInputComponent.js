import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sendDirectMessage } from '../actions/actionConversations';

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

	handleSubmit(e) {
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

		for (var i = 0; i < conversations.length; i++) {
			if (conversations[i].conversation_id === conversation_id) {
				conversations[i].messages.push(message);
			}
		}

		console.log(conversations)
	
		this.props.sendDirectMessage(conversation_id, participant_id, input, conversations);
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
		sendDirectMessage: sendDirectMessage
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TchatInputComponent);
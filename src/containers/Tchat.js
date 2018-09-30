import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getProfileRemittee} from '../selectors/index';

import io from 'socket.io-client'

class Tchat extends Component {

	constructor(props) {
		super(props) 

		this.state = {
			messageSend: '',
			id: ''
		}
		this.onChange = this.onChange.bind(this)
		// this.handleSubmit = this.handleSubmit.bind(this)
	}

	onChange (event) {
		this.setState({
		  messageSend: event.target.value
		})
	  }

	// async handleSubmit(e) {
	// 	var socket = io.connect('http://localhost:8080');
	// 	e.preventDefault();
	// 	var user_id = { user_id : this.state.id }
	// 	var messageSend = { message : this.state.messageSend}

	// 	const id_conversation = await axios.post('/api/findConversationID', user_id)
	// 	console.log('id convers', id_conversation.data[1])

	// 	socket.emit('subscribe', id_conversation.data[0])

	// 	const res = await axios.post('/api/addMessageBDD', messageSend)
	// 	if (res.data === 'success') {
	// 		socket.emit('send', {room : id_conversation.data[0], message : this.state.messageSend, id : id_conversation});
	// 		socket.on('message', function (message) {
	// 			console.log(user_id.user_id)
	// 			console.log(message.id.data[1])
	// 			if (user_id.user_id === message.id.data[1]) {
	// 				alert('Le serveur a un message pour vous : ' + message.message);
	// 				const newDiv = document.createElement('div')
	// 				newDiv.setAttribute("id", message.message + '1')
	// 				const currentDiv = document.getElementById("parentMessageContainer"); 
	// 				currentDiv.parentNode.insertBefore(newDiv, currentDiv);
	// 				document.getElementById(message.message + '1').innerHTML = message.message;
	// 			}
	// 		})
	// 		const newDiv = document.createElement('div')
	// 		newDiv.setAttribute("id", this.state.messageSend + '1')
	// 		const currentDiv = document.getElementById("parentMyMessContainer"); 
	// 		currentDiv.parentNode.insertBefore(newDiv, currentDiv);
	// 		document.getElementById(this.state.messageSend + '1').innerHTML = this.state.messageSend;
	// 		this.setState({
	// 			messageSend: ''
	// 		})
			
	// 	}
	// }

	render () {
		const { username } = this.props
		console.log('hello')
			return (
				<div className="TchatSection">
					<div className="HeadTchat">
						<p className="has-text-centered labelNameTchat">Conversation with {username}</p>
					</div>
					{/* <div className="columns BodyTchat">
						<div className="column is-5 is-offset-1 yourMessage">
							<p>hello</p>
							<div id="parentMessageContainer"> 
							</div>
						</div>
						<div className="column is-5 is-offset-1 myMessage">
							<p>hello</p>
							<div id="parentMyMessContainer"> 
							</div>
						</div>
					</div>
					<div className="InputTchat">
						<form className="columns" onSubmit={this.handleSubmit}>
							<div className="input_msg_write column is-10">
							<input className="write_msg" type="text"  placeholder="type a message" value={this.state.messageSend} onChange={this.onChange}/>
							<input type="hidden" value={this.state.id = user[0].user_id}/>
							</div>
							<p className="column is-1">
								<button className="button msg_send_btn" type="submit" value="submit">Send</button>
							</p>
						</form>
					</div> */}
				</div>
			)
		}
}

function mapStateToProps(state) {
    return {
		profileTchatID : getProfileRemittee(state) //profile du destinaire discussion
    }
}

export default connect(mapStateToProps, null)(Tchat)
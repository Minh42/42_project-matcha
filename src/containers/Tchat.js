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
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	onChange (event) {
		this.setState({
		  messageSend: event.target.value
		})
	  }

	async handleSubmit(e) {
		e.preventDefault();
		var data = { message : this.state.messageSend,
					user_id : this.state.id}

		const id_conversation = await axios.post('/api/findConversationID', data)
		console.log('id convers', id_conversation.data[0])
		
		const res = await axios.post('/api/addMessageBDD', data)
		if (res.data === 'success') {
			var socket = io.connect('http://localhost:8080');
			socket.emit('message', data);
			socket.on('message', function (message) {
				console.log(message.id)
				console.log(data.user_id)
				if (message.id != data.user_id) {
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

	render () {
		var user = this.props.profileTchatID
		console.log(user)
		if (user) {
			return (
				<div className="TchatSection">
					<div className="HeadTchat">
						<p className="has-text-centered labelNameTchat">Conversation with {user[0].username}</p>
					</div>
					<div className="columns BodyTchat">
						<div className="column is-5 is-offset-1">
							{/* <p>hello</p> */}
							<div id="parentMessageContainer"> 
							</div>
						</div>
						<div className="column is-5 is-offset-1">
							{/* <p>hello</p> */}
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
					</div>
				</div>
			)
		} else {
			return (
				<p>hello</p>
			)
		}
	}
}

function mapStateToProps(state) {
    return {
		profileTchatID : getProfileRemittee(state) //profile du destinaire discussion
    }
}

export default connect(mapStateToProps, null)(Tchat)
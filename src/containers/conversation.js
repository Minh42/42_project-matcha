import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { profileConversationAction } from '../actions/actionConversation';
import { profileTchatAction } from '../actions/actionOpenTchat';
import { getConversationProfileUser} from '../selectors/index';
import ConversationComponent from '../components/ConversationComponent'
import Tchat from '../components/ConversationComponent'

class Conversation extends Component {

	constructor(props) {
		super(props)

		this.state = {
			open: false,
			username: ''
		};

		this.openTchat = this.openTchat.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	async componentDidMount() {
		var res = await axios.post('/api/findAllConversation')
		this.props.profileConversationAction(res.data)
	}

	async handleSubmit(e) {
		var socket = io.connect('http://localhost:8080');
		e.preventDefault();
		var user_id = { user_id : this.state.id }
		var messageSend = { message : this.state.messageSend}

		const id_conversation = await axios.post('/api/findConversationID', user_id)
		console.log('id convers', id_conversation.data[1])

		socket.emit('subscribe', id_conversation.data[0])

		const res = await axios.post('/api/addMessageBDD', messageSend)
		if (res.data === 'success') {
			socket.emit('send', {room : id_conversation.data[0], message : this.state.messageSend, id : id_conversation});
			socket.on('message', function (message) {
				console.log(user_id.user_id)
				console.log(message.id.data[1])
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

	async openTchat(user_id) {
		console.log(user_id)
		const id = {user_id : user_id}
		const res = await axios.post('/api/findUserByID', id)
		console.log(res.data)
		//trouver l'username de l'utilisateur clique via son id(ci-dessus)
		this.setState ({
			open: true,
			username: res.data[0].username
		})
	}

	renderConversation() {
		if (this.props.matchConversation != undefined) {
			return this.props.matchConversation.map((user) => {
				return (
				<div key={user.user_id}>
					<ConversationComponent
						firstname={user.firstname}
						lastname={user.lastname}
						age={user.birth_date}
						src={user.imageProfile_path}
						onclick={() => this.openTchat(user.user_id)}
					/>
				</div>
				);
			});
		} else if (this.props.matchConversation === undefined)  {
			return (
				<p>no conversation</p>
			)
		}
	}

	renderTchat() {
		console.log(this.state.username)
		if (this.state.open === true) {
			return (
					<div className="TchatSection">
						<div className="HeadTchat">
							<p className="has-text-centered labelNameTchat">Conversation with {this.state.username}</p>
						</div>
					</div>
				)
		} else {
			return (
				<div>
					no tchat open
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
		matchConversation : getConversationProfileUser(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
		profileConversationAction : profileConversationAction,
		profileTchatAction : profileTchatAction
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Conversation)
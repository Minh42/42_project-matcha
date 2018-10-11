import React, { Component }  from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import izitoast from 'izitoast';
import Match from '../containers/Match';
import { bindActionCreators } from 'redux';
import { joinSocket } from '../actions/actionNotifications';
import Conversation from '../containers/Conversation';
import Tchat from '../containers/Tchat';
import { requestMessages, requestConversations } from '../actions/actionConversations';

class MessagesPage extends Component {
	constructor(props) {    
		super(props);
		this.state = {
			isUpdated: false,
		};
	}
	
	async componentDidMount() {
		this.props.joinSocket(this.props.currentUser[0].user_id);

		var currentUser = this.props.currentUser[0].user_id;
		var userList = this.props.socket.connectedUsers;
		var notifier_socketID;

		for(var i = 0; i < userList.length; i++) {
			if(userList[i].userID === currentUser) {
			  notifier_socketID = userList[i].socketID;
			}
		}
		var res = await axios.post('/api/findAllConversations');
		var conversationIDs = res.data;
		this.props.requestConversations(conversationIDs, currentUser);
		this.props.requestMessages(res.data, currentUser, notifier_socketID);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.socket != null && this.props.socket != null) {
			if (prevProps.socket.message != this.props.socket.message) {
				if (this.props.socket != null && !this.state.isUpdated) {
					if (this.props.socket.message != null) {
						izitoast.show({
							message: this.props.socket.message,
							position: 'topRight'
						});
					}
				}
			}
		}
	}

	render() {
		return (
			<div className="columns">
				<aside className="column is-3 aside backgroundInfoUser">
					<p className="labelTchat">Match</p>
					<div className="has-text-centered columnTchat ">
						<Match />
					</div>
				</aside>
				<div className="column is-3 hero is-fullheigth">
					<Conversation />
				</div>
				<div className="column is-6 hero is-fullheigth">
					<Tchat />
				</div>
			</div>
		);
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
		joinSocket: joinSocket,
		requestMessages: requestMessages,
		requestConversations: requestConversations
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesPage);
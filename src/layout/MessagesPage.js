import React, { Component }  from 'react';
import { connect } from 'react-redux';
import izitoast from 'izitoast';
import Match from '../containers/Match';
import { bindActionCreators } from 'redux';
import { joinSocket } from '../actions/actionNotifications';
import Conversation from '../containers/Conversation';
import Tchat from '../containers/Tchat';

class MessagesPage extends Component {
	componentDidMount() {
		this.props.joinSocket(this.props.currentUser[0].user_id);
	}

	componentDidUpdate() {
		if (this.props.socket.message != null) {
			izitoast.show({
				message: this.props.socket.message,
				position: 'topRight'
			});
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
		joinSocket: joinSocket
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MessagesPage);
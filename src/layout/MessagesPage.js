import React, { Component }  from 'react';
import { connect } from 'react-redux';
import izitoast from 'izitoast';
import Match from '../containers/Match'
import Conversation from '../containers/Conversation'
import Tchat from '../containers/Tchat'

class MessagesPage extends Component {

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
			<div className="columns" id="mail-app">
				<aside className="column is-3 aside backgroundInfoUser">
					<div className="column">
					<p className="labelTchat">Match</p>
						<div className="has-text-centered columnTchat ">
							<Match />
						</div>
					</div>
				</aside>
				<div className="column is-9">
					<Conversation />
				</div>
			</div>
		);
	}
}

function mapStateToProps(state) {
    return { 
		socket: state.socket
    };
}

export default connect(mapStateToProps, null)(MessagesPage);
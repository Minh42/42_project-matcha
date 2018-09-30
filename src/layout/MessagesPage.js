import React, { Component }  from 'react';
import { connect } from 'react-redux';
import izitoast from 'izitoast';
import Match from '../containers/Match'
import Conversation from '../containers/Conversation'
import Tchat from '../containers/Tchat'

class MessagesPage extends Component {

	componentDidUpdate() {
		console.log(this.props.socket.message)
		if (this.props.socket.message != null) {
			izitoast.show({
				message: this.props.socket.message,
				position: 'topRight'
			});
		}
	}

	render() {
		return (
			<section className="hero is-small">
			<div className="columns">
				<aside className="column is-4 aside">
					<p className="labelTchat">Match</p>
						<div className="has-text-centered columnTchat">
							<Match />
						</div>
					<p className="labelTchat">Chat room</p>
						<div className="has-text-centered columnTchat">
							<Conversation />
						</div>
				</aside>
				<div className="column is-8 messages hero is-fullheight">
					<Tchat />
				</div>
			</div>
			</section>
		);
	}
}

function mapStateToProps(state) {
    return { 
		socket: state.socket
    };
}

export default connect(mapStateToProps, null)(MessagesPage);
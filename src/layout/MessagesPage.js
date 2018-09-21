import React, { Component }  from 'react';
import Match from '../containers/Match'
import Conversation from '../containers/Conversation'
import Tchat from '../containers/Tchat'

class MessagesPage extends Component {

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
				<div className="column is-9 messages hero is-fullheight">
					<Tchat />
				</div>
			</div>
			</section>
		);
	}
}

export default MessagesPage;
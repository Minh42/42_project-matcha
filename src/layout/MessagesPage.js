import React, { Component }  from 'react';
import Match from '../containers/Match'

class MessagesPage extends Component {

	render() {
		return (
			<section className="hero is-small">
			<div className="columns">
				<aside className="column is-3 aside">
						<div className="has-text-centered columnTchat">
							<p className="labelTchat">Match</p>
							<Match />
						</div>
						<div className="has-text-centered columnTchat">
							<p className="labelTchat">Chat room</p>
						</div>
				</aside>
				<div className="column is-9 messages hero is-fullheight" id="message-feed">
				</div>
			</div>
			</section>
		);
	}
}

export default MessagesPage;
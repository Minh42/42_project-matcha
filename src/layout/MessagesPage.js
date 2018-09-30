import React, { Component }  from 'react';
import Match from '../containers/Match'
import Conversation from '../containers/Conversation'
import Tchat from '../containers/Tchat'

class MessagesPage extends Component {

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
				<div className="column is-9 messages hero is-fullheight" id="message-feed">
					<Conversation />
				</div>
				{/* <div className="column is-7 message hero is-fullheight" id="message-pane"> */}
					{/* {this.showEditFeature()} */}
				{/* </div> */}
			</div>
			// <section className="hero is-fullheigth">
			// <div className="columns">
			// 	<aside className="column is-3 aside">
			// 		<p className="labelTchat">Match</p>
			// 			<div className="has-text-centered">
			// 				<Match />
			// 			</div>
			// 	</aside>
			// 	<aside className="column is-3 aside">
			// 		<p className="labelTchat">Chat room</p>
			// 			<div className="has-text-centered">
			// 				{/* <Conversation /> */}
			// 				hello
			// 			</div>
			// 		{/* <div className="column is-8 messages hero is-fullheight"> */}
			// 			{/* <Tchat /> */}
			// 		{/* </div> */}
			// 	</aside>
			// </div>
			// </section>
		);
	}
}

export default MessagesPage;
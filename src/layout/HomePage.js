import React, { Component } from 'react';
// import SearchBar from '../components/SearchBar';
import UsersContainer from '../containers/UsersContainer';

class HomePage extends Component {
	render () {
		return (
		<div className="columns" id="mail-app">
			<aside className="column is-2 aside">
				<div className="compose">
					Hello
				</div>
			</aside>
			<div className="column is-10 messages hero is-fullheight" id="message-feed">
				<UsersContainer />
			</div>
		</div>
	)};
}

export default HomePage;
import React, { Component } from 'react';
import axios from 'axios';

class Match extends Component {

	async componentDidMount() {
		const res = await axios.get('/api/searchLikeProfileUser') // personne que l'on a liké
		console.log(res)
		
	}

	render() {
		return (
			<div className="columns">
				<div className="column is-10 is-offset-1">
					hello
				</div>
			</div>
		)
	}
}

export default Match;
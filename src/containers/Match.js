import React, { Component } from 'react';
import axios from 'axios';
import getAge from 'get-age';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getMatchProfiles } from '../selectors/index';
import { fetchCurrentUser } from '../actions/actionUsers';

class Match extends Component {
	constructor(props) {
		super(props)
		this.openConversation = this.openConversation.bind(this);
	}

	async componentDidMount() {
		this.props.fetchCurrentUser();
	}

	async openConversation(user_id) {
		await axios.post('/api/createConversationParticipant', {user_match : user_id})
	}

	render() {
		if (this.props.users != undefined) {
			return this.props.users.map((user) => {
				if (user.imageProfile_path.includes("cloudinary")) {
					var path = user.imageProfile_path;
				} else {
					var path = 'http://localhost:8080/' + user.imageProfile_path;
				}
				return (
					<div key={user.user_id} className="columns">
						<div className="column is-4 is-offset-1">
							<figure onClick={() => this.openConversation(user.user_id)}>
								<img className="size_image" src={path} height="20px"/>
							</figure>
						</div>
						<div className="column is-6 ">
							<p>{user.firstname} {user.lastname}, {getAge(user.birth_date)}</p>
						</div>
					</div>
				)
			})
		} else {
			return (
				<div className="columns">
					<div className="column is-10 is-offset-1">
						No match
					</div>
				</div>
			)
		}
	}
}

function mapStateToProps(state) {
    return {
		users : getMatchProfiles(state)
    }
}


function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchCurrentUser: fetchCurrentUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Match);
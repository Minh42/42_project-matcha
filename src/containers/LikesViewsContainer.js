import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

class LikesViewsContainer extends Component {
	render() {
		return (
			<div className="columns is-mobile">
				<div className="column is-6">
					<a className="button is-small is-fullwidth" onClick={this.toggleEditProfilePicture}>Likes</a>
				</div>
				<div className="column is-6">
					<a className="button is-small is-fullwidth" onClick={this.toggleEditPersonnalInfo}>Views</a>
				</div>
			</div>
		)
	}
}

export default LikesViewsContainer
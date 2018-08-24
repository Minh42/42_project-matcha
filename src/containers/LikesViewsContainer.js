import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';

import { getLikesUser } from '../selectors/index'

import LikesComponent from '../components/LikesComponent';
import ViewsComponent from '../components/ViewsComponent';

class LikesViewsContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			EditLikes: false,
			EditViews: false
		};
		this.toggleLikes =this.toggleLikes.bind(this);
		this.toggleViews = this.toggleViews.bind(this);
	}

	componentDidMount() {
		this.props.fetchUsers();
    }

	toggleLikes() {
		document.getElementById('likes').style.backgroundColor = "rgba(229, 42, 111, 0.461)";
		document.getElementById('views').style.backgroundColor = "white";
		this.setState({
			EditLikes: !this.state.EditLikes,
			EditViews: false
		})
	}

	toggleViews() {
		document.getElementById('views').style.backgroundColor = "rgba(229, 42, 111, 0.461)";
		document.getElementById('likes').style.backgroundColor = "white";
		this.setState({
			EditViews: !this.state.EditViews,
			EditLikes: false
		})
	}

	showLikesOrViews() {
		console.log(this.props.likesUser)
		if (this.state.EditLikes) {
			return (
				<LikesComponent 
					likes={this.props.likesUser}
				/>
			)
		} else {
			return (
				<ViewsComponent 
				
				/>
			)
		}
	}

	render() {
		return (
		<div>
			<div className="columns is-mobile">
				<div className="column is-6">
					<a id="likes" className="button is-small is-fullwidth buttonLikesViews" onClick={this.toggleLikes}>Likes</a>
				</div>
				<div className="column is-6">
					<a id="views" className="button is-small is-fullwidth buttonLikesViews" onClick={this.toggleViews}>Views</a>
				</div>
			</div>
			<div className="columns is-multiline">
				<div className="column is-12 is-fullwidth">
					{this.showLikesOrViews()}
				</div>
			</div>
		</div>
		)
	}
}

function mapStateToProps(state) {
    return {
        likesUser: getLikesUser(state),
        loading: state.users.loading,
		error: state.users.error,
		currentUser: state.auth.currentUser
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchUsers: fetchUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LikesViewsContainer)
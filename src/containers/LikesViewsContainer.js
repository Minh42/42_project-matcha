import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getLikesUsers } from '../selectors/index';
import { getViewsUsers } from '../selectors/index';
import { fetchUsers } from '../actions/actionFetch';
import LikesComponent from '../components/LikesComponent';
import ViewsComponent from '../components/ViewsComponent';

class LikesViewsContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLikes: true,
			isViews: false
		};
		this.toggleLikes = this.toggleLikes.bind(this);
		this.toggleViews = this.toggleViews.bind(this);
	}

    componentDidMount() {
        this.props.fetchUsers();
    }

	toggleLikes() {
		document.getElementById("likes").classList.add("is-active");
		document.getElementById("views").classList.remove("is-active");
		this.state.isLikes ? null : this.setState({ isLikes: !this.state.isLikes, isViews: false })
	}

	toggleViews() {
		document.getElementById("views").classList.add("is-active");
		document.getElementById("likes").classList.remove("is-active");
		this.state.isViews? null : this.setState({ isViews: !this.state.isViews, isLikes: false })
	}

	showLikesOrViews() {
		if (this.state.isLikes) {
			var users = this.props.usersLikes;
			if (users === 'undefined' || users === null || users === '' || users.length <= 0) {
				return (
					<div>No likes</div>
				)
			} else {
				return (
					<LikesComponent 
						users={users}
					/>
				)
			}
		} else if (this.state.isViews) {
			console.log('im in views')
			var users = this.props.usersViews;
			console.log(users)
			if (users === 'undefined' || users === null || users === '' || users.length <= 0) {
				return (
					<div>No views</div>
				)
			} else {
				return (
					<ViewsComponent 
						users={users}
					/>
				)
			}
		}
	}

	render() {
		return (
		<div className="column">
			<div className="tabs is-toggle is-small is-fullwidth">
				<ul>
					<li id="likes" className="is-active" onClick={this.toggleLikes}><a>Likes</a></li>
					<li id="views" onClick={this.toggleViews}><a>Views</a></li>

				</ul>
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
		usersLikes: getLikesUsers(state),
		usersViews: getViewsUsers(state),
		currentUser: state.auth.currentUser
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchUsers: fetchUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LikesViewsContainer)
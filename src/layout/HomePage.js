import React, { Component } from 'react';
import UsersContainer from '../containers/UsersContainer';
import Filters from '../containers/Filters';
import SortBy from '../containers/SortBy';
import SearchTags from '../containers/SearchTags';
import { connect } from 'react-redux';
import { setOnboarding, setUnOnboarding } from '../actions/actionUsers';
import { joinSocket } from '../actions/actionNotifications';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';
import izitoast from 'izitoast';

class HomePage extends Component {
    constructor(props) {    
		super(props);
		this.state = {
			isUpdated: false,
		};
	}

	async componentDidMount() {
		const res = await axios.get('/api/onboarding');
		if(res.data) {
			this.props.history.push('/onboarding');
		} else {
			this.props.joinSocket(this.props.currentUser[0].user_id);
		}
	}

	componentDidUpdate(prevProps) {
		if (prevProps.socket != null && this.props.socket != null) {
			if (prevProps.socket.message != this.props.socket.message) {
				if (this.props.socket != null && !this.state.isUpdated) {
					if (this.props.socket.message != null) {
						izitoast.show({
							message: this.props.socket.message,
							position: 'topRight'
						});
					}
				}
			}
		}
	}
	
	render () {
		return (
		<div className="columns">
			<aside className="column is-4 aside">
				<div className="columns">
					<SortBy />
				</div>
				<div className="columns">
					<Filters />
				</div>
				<div className="columns">
					<SearchTags />
				</div>
			</aside>
			<div className="column is-8 messages hero is-fullheight" id="message-feed">
					<UsersContainer />
			</div>
		</div>
	)};
}

HomePage.propTypes = {
	// currentUser: PropTypes.array.isRequired,
	// socket: PropTypes.node.isRequired,
	setOnboarding: PropTypes.func.isRequired,
	setUnOnboarding: PropTypes.func.isRequired,
	joinSocket: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
    return {
	  currentUser: state.auth.currentUser,
	  socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		setOnboarding: setOnboarding,
		setUnOnboarding: setUnOnboarding,
		joinSocket: joinSocket
	}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
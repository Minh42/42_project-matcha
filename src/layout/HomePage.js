import React, { Component } from 'react';
import UsersContainer from '../containers/UsersContainer';
import Filters from '../containers/Filters';
import SortBy from '../containers/SortBy';
import SearchTags from '../containers/SearchTags';
import { connect } from 'react-redux';
import { setUnOnboarding, addFlashMessage } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import FlashMessagesList from '../components/FlashMessagesList';
import PropTypes from 'prop-types';
import axios from 'axios';
import izitoast from 'izitoast';
import io from 'socket.io-client';

const socket = io('http://localhost:8080', { transports: ['websocket'] });

class HomePage extends Component {
    constructor(props) {
		super(props);
	}

	async componentDidMount() {
		// console.log(this.props.socket)
		// const socket = this.props.socket;
		const res = await axios.get('/api/onboarding');
		if(res.data) {
			this.props.history.push('/onboarding');
		} else {
			this.props.setUnOnboarding();
			socket.emit('new_user', this.props.currentUser[0].user_id);
			socket.on('userlist', (userList, socketID) => {
				window.socketID = null;
				window.selectedUser = null;
				if (window.socketID === null) {
					window.socketID = socketID;
				}
				window.userList = userList;
			})
			socket.on('exit', (userList) => {
				window.userList = userList;
			})
			socket.on('show_notification', (data) => {
				izitoast.show({
					image: '',
					message: data.text,
					position: 'topRight'
				});
			})
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
					<FlashMessagesList />
					<UsersContainer 
						socket={socket}
					/>
			</div>
		</div>
	)};
}

HomePage.propTypes = {
	setUnOnboarding: PropTypes.func.isRequired,
	addFlashMessage: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
	  currentUser: state.auth.currentUser,
	//   socket: state.socket
    };
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		  setUnOnboarding: setUnOnboarding,
		  addFlashMessage: addFlashMessage
	}, dispatch);
  }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
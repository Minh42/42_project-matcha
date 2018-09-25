import React, { Component } from 'react';
import UsersContainer from '../containers/UsersContainer';
import Filters from '../containers/Filters';
import SortBy from '../containers/SortBy';
import SearchTags from '../containers/SearchTags';
import { connect } from 'react-redux';
import { setUnOnboarding } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import FlashMessagesList from '../components/FlashMessagesList';
import PropTypes from 'prop-types';
import axios from 'axios';
import io from 'socket.io-client';

class HomePage extends Component {
    constructor(props) {
		super(props);
	}

	async componentDidMount() {
		const res = await axios.get('/api/onboarding');
		if(res.data) {
			this.props.history.push('/onboarding');
		} else {
			this.props.setUnOnboarding();
		}
	}
	
	render () {
		return (
		<div className="columns">
			<FlashMessagesList />
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
	setUnOnboarding: PropTypes.func.isRequired
};

function mapStateToProps(state) {
    return {
      currentUser: state.auth.currentUser
    };
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	  	setUnOnboarding: setUnOnboarding
	}, dispatch);
  }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
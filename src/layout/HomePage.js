import React, { Component } from 'react';
// import SearchBar from '../components/SearchBar';
import UsersContainer from '../containers/UsersContainer';
import Filters from '../containers/Filters';
import SortBy from '../containers/SortBy';
import SearchTags from '../containers/SearchTags';
import { connect } from 'react-redux';
import { setUnOnboarding } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

class HomePage extends Component {

	async componentDidMount(){
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
			<aside className="column is-4 aside">
				<div className="column">
					<SortBy />
				</div>
				<div className="column">
					<Filters />
				</div>
				<div className="column">
					<SearchTags />
				</div>
			</aside>
			<div className="column is-8 messages hero is-fullheight" id="message-feed">
				{/* <div className="columns"> */}
					<UsersContainer />
				{/* </div> */}
			</div>
		</div>
	)};
}

HomePage.propTypes = {
	setUnOnboarding: PropTypes.func.isRequired
};

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
	  	setUnOnboarding: setUnOnboarding
	}, dispatch);
  }

export default withRouter(connect(null, mapDispatchToProps)(HomePage));
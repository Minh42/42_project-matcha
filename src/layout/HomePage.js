import React, { Component } from 'react';
// import SearchBar from '../components/SearchBar';
import UsersContainer from '../containers/UsersContainer';
import { connect } from 'react-redux';
import { setUnOnboarding } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

class HomePage extends Component {

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
		<div className="columns" id="mail-app">
			<aside className="column is-4 aside">
				<div className="compose">
					Hello
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
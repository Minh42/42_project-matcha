import React, { Component } from 'react';
// import SearchBar from '../components/SearchBar';
import UsersContainer from '../containers/UsersContainer';
import { connect } from 'react-redux';
import { setUnOnboarding } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

class HomePage extends Component {

	componentDidMount(){
		this.props.setUnOnboarding();
	}
	render () {
		return (
		<div className="columns" id="mail-app">
			<aside className="column is-2 aside">
				<div className="compose">
					Hello
				</div>
			</aside>
			<div className="column is-10 messages hero is-fullheight" id="message-feed">
				<UsersContainer />
			</div>
		</div>
	)};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ 
	  setUnOnboarding: setUnOnboarding
	}, dispatch);
  }

export default connect(null, mapDispatchToProps)(HomePage);
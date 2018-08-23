import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

class LikesComponent extends Component {
	render() {
		return (
			<div>
				SHOW LIKES
			</div>
		)
	}
}

export default LikesComponent
import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../actions/actionUsers';
import { bindActionCreators } from 'redux';

class ViewsComponent extends Component {
	render() {
		return (
			<div>
				SHOW VIEWS
			</div>
		)
	}
}

export default ViewsComponent
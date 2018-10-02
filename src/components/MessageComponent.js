import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageComponent extends Component {

	render() {
		const { firstname, lastname, message, from } = this.props;
		if (this.props.currentUser != null) {
			var currentUser = this.props.currentUser[0].user_id;
			var fromMe = (currentUser === from) ? 'from-me' : '';
		}
		return (
		  <div className={`message ${fromMe}`}>
			<div className='name'>
			  { firstname } {lastname}
			</div>
			<div className='message-body'>
			  { message }
			</div>
		  </div>
		);
	}
}

function mapStateToProps(state) {
    return {
		currentUser: state.auth.currentUser,
    }
}

export default connect(mapStateToProps, null)(MessageComponent);
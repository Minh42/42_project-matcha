import React, { Component } from 'react';
import { connect } from 'react-redux';

class FlashMessage extends Component {
	render() {

		const { message, style } = this.props.flashMessage;
		if (!message) {
			return null;
		}
		
		return (
			<div className={'notification' + style}>
				{message}
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { 
		flashMessage: state.flashMessage
	};
}

export default connect(mapStateToProps)(FlashMessage);
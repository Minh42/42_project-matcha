import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

class FlashMessage extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.props.deleteFlashMessage(this.props.message.id);
	}

	render() {
		const { id, type, text } = this.props.message;
		return (
			<div className={classnames('notification', {
				'is-success': type === 'success',
				'is-danger': type === 'error',
				'is-info': type === 'info',
				'is-warning': type === 'warning'
			})}>
				<button onClick={this.handleClick} className="delete"></button>
				{text}
			</div>
		);
	}
}

FlashMessage.propTypes = {
	message: PropTypes.object.isRequired,
	deleteFlashMessage: PropTypes.func.isRequired
}

export default FlashMessage;
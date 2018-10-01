import React, { Component } from 'react';

class ConversationComponent extends Component {

	render() {
		const { firstname, lastname, src, message, onClick} = this.props;
		return (
			<div className="tchatRoom columns" onClick={onClick}>
				<div className="column is-4 is-offset-1">
					<figure>
						<img className="size_image" src={src} height="20px"/>
					</figure>
				</div>
				<div className="column is-4">
					<p> {firstname} {lastname} </p>
					<p> {message} </p>
				</div>
			</div>
		)
	}
}

export default ConversationComponent


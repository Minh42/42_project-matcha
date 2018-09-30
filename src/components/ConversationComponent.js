import React, { Component } from 'react';
import getAge from 'get-age';

class ConversationComponent extends Component {

	render() {
		const { firstname, lastname, age, src, onclick} = this.props;
		return (
			<div className="tchatRoom columns" onClick={onclick}>
				<div className="column is-4 is-offset-1">
					<figure>
						<img className="size_image" src={src} height="20px"/>
					</figure>
				</div>
				<div className="column is-4">
					<p>{firstname} {lastname}, {getAge(age)}</p>
				</div>
			</div>
		)
	}
}

export default ConversationComponent


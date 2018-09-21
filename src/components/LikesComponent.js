import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import getAge from 'get-age';

class LikesComponent extends Component {
	constructor(props) {
		super(props);
        this.handleClick = this.handleClick.bind(this);
	}
	
	handleClick() {
		this.props.history.push('/otherProfile/' + this.props.id);
	}


	render() {
        const { id, firstname, lastname, age, occupation, src } = this.props;
		if (src.includes("cloudinary")) {
			var path = src;
		} else {
			var path = 'http://localhost:8080/' + src;
		}
		return (
			<div>
				<article className="media">
					<figure className="media-left">
						<p className="image is-96x96">
							<img src={path} alt="userLikes" onClick={this.handleClick}/>
						</p>
					</figure>
					<div className="media-content">
						<p> {firstname} {lastname}, {getAge(age)}</p>
						<p> {occupation} </p>
					</div>
				</article>
			</div>	
		)
	}
}

export default withRouter(LikesComponent);

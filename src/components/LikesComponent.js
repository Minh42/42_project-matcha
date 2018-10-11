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
			<div className="columns">
				<div className="column is-6">
					<img src={path} alt="userLikes" onClick={this.handleClick} />
				</div>
				<div className="column is-6">
					<p className="id_font"> {firstname} {lastname}, {getAge(age)}</p>
					<p className="id_font"> {occupation} </p>
				</div>
			</div>	
		)
	}
}

export default withRouter(LikesComponent);

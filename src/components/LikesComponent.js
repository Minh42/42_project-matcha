import React, { Component } from 'react';
import getAge from 'get-age';
import { withRouter } from 'react-router-dom';

class LikesComponent extends Component {

	constructor(props) {
        super(props)

        this.showProfile = this.showProfile.bind(this)
    }

	showProfile() {
		const user_id = document.getElementById("imageLike").alt
		console.log("id", user_id)
        this.props.history.push('/profileOtherUser/' + user_id);
	}
	
	render() {
		const { users } = this.props;
		return this.props.users.map(user => {
			if (user.imageProfile_path.includes("cloudinary")) {
				var src = user.imageProfile_path;
			} else {
				var src = 'http://localhost:8080/' + user.imageProfile_path;
			}
			return (
				<div key={user.user_id}>
					<article className="media">
						<figure className="media-left">
							<p className="image is-96x96">
								<img src={src} alt="userLikes"/>
							</p>
						</figure>
						<div className="media-content">
							<p> {user.firstname} {user.lastname}, {getAge(user.birth_date)}</p>
							<p> {user.occupation} </p>
						</div>
					</article>
				</div>
			)
		})
	}
}

export default withRouter(LikesComponent)
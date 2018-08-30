import React, { Component } from 'react';
import getAge from 'get-age';

class LikesComponent extends Component {
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

export default LikesComponent
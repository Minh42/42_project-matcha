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
		const { likes } = this.props
		console.log(likes)
		var src = 'http://localhost:8080/public/img/australie.jpg';
		return likes.map(users => {
			var birthDate = getAge(users.birth_date)
			return (
				<div key={ users.user_id } className="columns">
					<div className="column is-5">
						<figure className="image is-96x96">
							<img src={ src } id="imageLike" className="imageLike" alt={ users.user_id } onClick={this.showProfile}/>
						</figure>
					</div>
					<div className="column is-5 is-offset-1">
						<p className="labelLike"> { users.username } </p>
						<p className="labelLike"> { birthDate } </p>
					</div>
				</div>
			)
		})
	}
}

export default withRouter(LikesComponent)
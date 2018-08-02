import React from 'react';
import ReactDOM from 'react-dom';

import Button from "../components/Button";
import { Link } from 'react-router-dom';

class ProfileUser extends React.Component{
	constructor(props) {
		super(props);
	  }

	render () {
	return (
	<div className="container">
		<div className="columns is-mobile">
			<div className="column box">
				<div>login</div>
				<div>
					<p>Age</p>
					<p>gender</p>
					<p>orientation</p>
				</div>
				<div>Bio</div>
				<div>Tags</div>
					<Link to="/ModifProfile"><Button className="button is-rounded" title="Change Informations"/></Link>
			</div>
			<div className="column box">
				Photo profile
				<div>
					<Link to=""><Button className="button is-rounded" title="add a picture"/></Link>
				</div>
			</div>
		</div>
	</div>
	)}
}

export default ProfileUser;
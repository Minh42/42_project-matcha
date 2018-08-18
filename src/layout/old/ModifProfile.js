import React from 'react';
import ReactDOM from 'react-dom';
import ChangePasswordContainer from '../containers/ChangePasswordContainer';
import ModificationContainer from '../containers/ModificationContainer';
import NewInfoUserContainer from '../containers/NewInfoUserContainer';

class ModifUser extends React.Component{
	render () {
	return (
	<section className="hero">
		<div className="hero-body hero-body-hp-main">
			<div className="container">
				<div className="columns is-mobile">
					<div className="column is-5">
						<ModificationContainer /> 
					</div>
					<div className="column is-6 is-offset-1">
						<ChangePasswordContainer /> 
					</div>
				</div>
				<div className="columns is-mobile">
					<div className="column is-5">
						<NewInfoUserContainer /> 
					</div>
				</div>
			</div>
		</div>
	</section>
	)}
}

export default ModifUser;
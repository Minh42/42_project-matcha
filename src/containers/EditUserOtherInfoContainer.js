import React, { Component } from 'react';

import NewInfoUserContainer from './NewInfoUserContainer';
import TagsComponent from '../components/TagsComponent';
import LocationComponent from '../components/LocationComponent';

class EditUserProfileContainer extends Component {

    render () {
        return (
		<div>
			<div className="columns is-mobile">
				<div className="column is-5">
					<NewInfoUserContainer 
						user={this.props.user}
					/> 
				</div>
				<div className="column is-5 is-offset-1">
					<TagsComponent /> 
				</div>
			</div>
				<LocationComponent/>
		</div>
    )};
}

export default EditUserProfileContainer;

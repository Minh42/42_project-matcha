import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import NewInfoUserContainer from './NewInfoUserContainer';
import TagsComponent from '../components/TagsComponent';

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
		</div>
    )};
}

export default EditUserProfileContainer;
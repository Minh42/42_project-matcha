import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ChangePasswordContainer from './ChangePasswordContainer';
import ModificationContainer from './ModificationContainer';

import axios from 'axios';

class EditUserProfileContainer extends Component {

    async componentDidMount() {
		const res = await axios.get('/api/profile');
        this.props.selectUser(res);
	}

    render () {
        return (
             <div>
                <div className="columns is-mobile">
                    <div className="column is-5">
                        <ModificationContainer 
                            user={this.props.user}
                        /> 
                    </div>
                    <div className="column is-5 is-offset-1">
                        <ChangePasswordContainer /> 
                    </div>
                </div>
             </div>
    )};
}

export default EditUserProfileContainer;

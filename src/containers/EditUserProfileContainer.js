import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import ChangePasswordContainer from './ChangePasswordContainer';
import ModificationContainer from './ModificationContainer';
import NewInfoUserContainer from './NewInfoUserContainer';
import TagsComponent from '../components/TagsComponent';

class EditUserProfileContainer extends Component {

    render () {
        return (
             <div>
                <div className="columns is-mobile">
                    <div className="column is-5">
                        <h2>Personnal Informations</h2>
                        <ModificationContainer /> 
                    </div>
                    <div className="column is-5 is-offset-1">
                        <h2>Change your password</h2>
                        <ChangePasswordContainer /> 
                    </div>
                    </div>
                    <div className="columns is-mobile">
                    <div className="column is-5">
                        <h2>Other informations</h2>
                        <NewInfoUserContainer /> 
                    </div>
                    <div className="column is-5 is-offset-1">
                        <h2>Change your tags</h2>
                        <TagsComponent /> 
                    </div>
                </div>
             </div>
    )};
}

export default EditUserProfileContainer;
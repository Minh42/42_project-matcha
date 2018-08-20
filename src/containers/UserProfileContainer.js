import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import CarouselContainer from './CarouselContainer';

class UserProfileContainer extends Component {

    render () {
        var getAge = require('get-age')
        return (
        <div className="container is-fluid">
            <div className="card">
                <div className="header">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4"> {this.props.user.firstname} {this.props.user.lastname}, {getAge(this.props.user.birth_date)}</p>
                            <p className="subtitle is-6">@{this.props.user.username}</p>
                        </div>
                    </div>
                </div>
                <div className="card-image">
                    <CarouselContainer 
                        photos={this.props.photos}
                    />
                </div>
                <div className="card-content">
                    <div className="content">
                        <div class="field">
                            <label class="label">Bio</label>
                            <div class="control">
                                {this.props.user.bio}
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">Occupation</label>
                            <div class="control">
                                I work as a "{this.props.user.occupation}"
                            </div>
                        </div>  
                        <div class="field">
                            <label class="label">I'm interested in</label>
                            <div class="control">
                                {this.props.user.occupation}
                            </div>
                        </div>
                        <div class="field">
                            <label class="label">I'm looking for</label>
                            <div class="control">
                                {this.props.user.occupation}
                            </div>
                        </div>                      
                    </div>
                </div>
            </div>
        </div>
    )};
}

export default UserProfileContainer;
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import CarouselContainer from './CarouselContainer';

class UserProfileContainer extends Component {

    showTitle() {
        var getAge = require('get-age')
        if (this.props.user.gender === "man") {
            return (
                <p className="title is-4">♂ {this.props.user.firstname} {this.props.user.lastname}, {getAge(this.props.user.birth_date)}</p>
            )
        } else {
            return (
                <p className="title is-4">♀ {this.props.user.firstname} {this.props.user.lastname}, {getAge(this.props.user.birth_date)}</p>
            )    
        }
    }

    showInterests() {
        return this.props.tags.map(tag => {
            const uuidv4 = require('uuid/v4');
            var id = uuidv4();
            return (
              <div key={id}>#{tag.name}</div>
            );
        })
    }

    render () {
        return (
        <div className="container is-fluid">
            <div className="card">
                <div className="header">
                    <div className="media">
                        <div className="media-content">
                            {this.showTitle()}
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
                        <div className="field">
                            <label className="label">Bio</label>
                            <div className="control">
                                {this.props.user.bio}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Occupation</label>
                            <div className="control">
                                I work as a "{this.props.user.occupation}"
                            </div>
                        </div>  
                        <div className="field">
                            <label className="label">I'm interested in</label>
                            <div className="control">
                                {this.props.interest[0].name}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">I'm looking for</label>
                            <div className="control">
                                {this.props.relationship[0].name}
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Interests</label>
                            <div className="control">
                                {this.showInterests()}
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
        </div>
    )};
}

export default UserProfileContainer;
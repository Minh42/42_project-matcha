import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import CarouselContainer from '../containers/CarouselContainer';

class UserProfileContainer extends Component {
    render () {
        return (
        <div className="container is-fluid">
            <div className="card">
                <div className="header">
                    <div className="media">
                        <div className="media-content">
                            <p className="title is-4"> Pham, 28</p>
                            <p className="subtitle is-6">@johnsmith</p>
                        </div>
                    </div>
                </div>
                <div className="card-image">
                    <figure className="image is-4by3">
                    <img src="https://source.unsplash.com/random/1280x960" alt="Placeholder image"/>
                    </figure>
                </div>
                <div className="card-content">
                    <div className="content">
                        <p>
                            <strong>32 Likes</strong>
                        </p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
                        <a>@bulmaio</a>.
                        <a href="#">#css</a>
                        <a href="#">#responsive</a>
                    </div>
                </div>
            </div>
        </div>
    )};
}

export default UserProfileContainer;
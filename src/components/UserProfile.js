import React, { Component } from 'react';

class UserProfile extends Component {

    render() {
        const { username, age, src } = this.props;
        return (
            <div className="column is-one-quarter-desktop is-half-tablet">
                <div className="card">
                    <div className="card-image">
                        <figure className="image is-3by2">
                            <img src={src} alt=""/>
                        </figure>
                        <div className="card-content is-overlay is-clipped">
                            <span className="tag is-info">
                                {username} {age}
                            </span>       
                        </div>
                    </div>
                    <footer className="card-footer">
                        <a className="card-footer-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <button className="button is-rounded round-button">
                                        <span className="icon">
                                            <i className="fa fa-star"></i>
                                        </span>
                                    </button>
                                </p>
                                <p className="control">
                                    <button className="button is-rounded round-button">
                                        <span className="icon">
                                            <i className="fas fa-heart"></i>
                                        </span>
                                    </button>
                                </p>
                                <p className="control">
                                    <button className="button is-rounded round-button">
                                        <span className="icon">
                                            <i className="fas fa-comment"></i>
                                        </span>
                                    </button>
                                </p>
                            </div>
                        </a>
                    </footer>
                </div>
            </div>
        )
    }
}

export default UserProfile;
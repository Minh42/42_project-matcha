import React, { Component } from 'react';
import SearchBar from '../components/SearchBar';
import List from '../components/List';
import axios from 'axios'

class GalleryContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
          users: [],
          store: []
        }
    }

    componentDidMount(){
        axios.get('https://randomuser.me/api/?results=10')
        .then(json => json.data.results.map(result => (
          {
            id: result.registered,
            firstname: result.name.first,
            lastname: result.name.last,
            age: result.dob.age,
            picture: result.picture.medium
          })))
        .then(newData => console.log(newData))
        .then(newData => this.setState({users: newData, store: newData}))
    }

    render() {
        const {users} = this.state
        return (
          <div className="Card">
            <div className="header">NAME LIST</div>
            <SearchBar searchFunc={(e) => this.filterNames(e)}/>
            <List usernames={users}/>
          </div>
        );
    }

    render() {
        return (
            <div className="columns is-multiline">
                <div className="column is-one-quarter-desktop is-half-tablet">
                    <div className="card">
                        <div className="card-image">
                            <figure className="image is-3by2">
                                <img src="https://unsplash.it/300/200/?random&pic=1" alt=""/>
                            </figure>
                            <div className="card-content is-overlay is-clipped">
                                <span className="tag is-info">
                                    Photo
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
            </div>
        )
    }
}

export default GalleryContainer;
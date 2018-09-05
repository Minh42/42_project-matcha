import React, { Component } from 'react';
import SignupContainer from '../containers/SignupContainer';
import FlashMessagesList from '../components/FlashMessagesList';
import image from '../../public/img/test.jpg';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class LandingPage extends Component {
    
    componentDidMount() {
        if (this.props.auth) {
            if (this.props.auth.authenticated) {
                this.props.history.push('/homepage');
            }
        }
    }
    
    render() {
        return (
            <div className="landing">
                <section className="hero is-fullheight">
                    <div className="hero-body">
                        <div className="container">
                            <FlashMessagesList />
                            <div className="columns">
                                {/* <div className="column is-4 is-offset-1">
                                    <img src={image} alt="image" class="responsive-image"/>
                                </div> */}
                                <div className="column">
                                    <SignupContainer />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return { 
        auth: state.auth
    };
}

export default connect(mapStateToProps, null)(LandingPage);
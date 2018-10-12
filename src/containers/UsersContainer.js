import React, {Component} from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';
import { fetchCurrentUser } from '../actions/actionUsers';
import withInfiniteScroll from '../components/InfiniteScrollHOC';
import PropTypes from 'prop-types';
import { ClipLoader } from 'react-spinners';

class UsersContainer extends Component {
    componentDidMount() {
        this.props.fetchCurrentUser();
    }

    renderList() {
        if(this.props.users) {
            return this.props.users.map((user) => {
                return (
                <div key={user.user_id} className="column is-half">
                    <UserProfile
                        id={user.user_id}
                        firstname={user.firstname}
                        lastname={user.lastname}
                        age={user.birth_date}
                        src={user.imageProfile_path}
                    />
                </div>
                );
            });
        } else {
            return;
        }
    }

    render() {
        const { loading, error } = this.props;
        if (error) {
            return (
                <div>{error.message}</div>
            )
        }
        if(loading) {
            return (
                <div className="pageloader has-text-centered">
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#000'}
                        loading={loading}
                    />
                </div>
            )
        }
        return (
            <div className="columns is-multiline">
               { this.renderList() }
            </div>
        )
    }
}

UsersContainer.propTypes = {
    fetchUsers: PropTypes.func.isRequired,
    fetchCurrentUser: PropTypes.func.isRequired
};


function mapStateToProps(state) {
    return {
        loading: state.users.loading
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchUsers: fetchUsers,
        fetchCurrentUser: fetchCurrentUser
    }, dispatch);
}

const WrappedComponent = withInfiniteScroll(UsersContainer);

export default connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
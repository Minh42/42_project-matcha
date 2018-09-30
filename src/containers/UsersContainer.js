import React, {Component} from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';
import { getFilterUsers } from '../selectors/index';
import { fetchCurrentUser } from '../actions/actionUsers';
import PropTypes from 'prop-types';

class UsersContainer extends Component {
    componentDidMount() {
        this.props.fetchCurrentUser();
        this.props.fetchUsers();
    }

    renderList() {
        const {socket} = this.props;
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
                        socket={socket}
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
                <div className="pageloader">
                    <span className="title">Pageloader</span>
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
        users: getFilterUsers(state),
        loading: state.users.loading,
        error: state.users.error
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchUsers: fetchUsers,
        fetchCurrentUser: fetchCurrentUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
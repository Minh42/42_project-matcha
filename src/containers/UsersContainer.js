import React, {Component} from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';
import { selectUser } from '../actions/actionUsers';
import PropTypes from 'prop-types';

class UsersContainer extends Component {
    componentDidMount(){
        this.props.fetchUsers();
    }
       
    renderList() {
        return this.props.users.map((user) => {
            return (
                <UserProfile
                    key={user.id}
                    user={user.username}
                    age={user.age}
                    src={user.picture}
                />
            );
        });
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
	fetchUsers: PropTypes.func.isRequired
};


function mapStateToProps(state) {
    return {
        users: state.users.items,
        loading: state.users.loading,
        error: state.users.error
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchUsers: fetchUsers,
        selectUser: selectUser
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
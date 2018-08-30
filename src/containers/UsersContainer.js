import React, {Component} from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';
import { getFilterUsers } from '../selectors/index';
import { getMaeva } from '../selectors/index';
import { getAllUsers } from '../selectors/index';
import PropTypes from 'prop-types';

class UsersContainer extends Component {

    componentDidMount() {
		this.props.fetchUsers();
    }
    
    renderList() {
        console.log("filterUsers:", this.props.users)
        return this.props.users.map((user) => {
            return (
            <div key={user.user_id} className="column is-half">
                <UserProfile
                    id={user.user_id}
                    user={user.username}
                    age={user.birth_date}
                    src={user.imageProfile_path}
                />
            </div>
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
        users: getFilterUsers(state)
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ 
        fetchUsers: fetchUsers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
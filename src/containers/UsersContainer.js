import React, {Component} from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';
import PropTypes from 'prop-types';

class UsersContainer extends Component {
    componentDidMount(){
        this.props.fetchUsers();
    }
       
    // renderList() {
        // console.log(this.props.users);
        // return this.props.users.map((user) => {
        //     return (
        //         <UserProfile 
        //             key={user.id} 
        //             firstname={user.firstname}
        //             lastname={user.lastname}
        //             age={user.age}
        //             src={user.img}
        //         />
        //     );
        // });
    // }

    render() {
        const { items, loading, error } = this.props;
        return (
            <div className="columns is-multiline">
               {/* { this.renderList() } */}
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
    return bindActionCreators({ fetchUsers: fetchUsers}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersContainer);
import React, {Component} from 'react';
import UserProfile from '../components/UserProfile';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchUsers } from '../actions/actionFetch';
import { fetchCurrentUser } from '../actions/actionUsers';
import { getActualUser, getFilterUsers, getMatchedUsers } from '../selectors/index';
import { MakeQuerablePromise } from '../../library/tools';
import PropTypes from 'prop-types';

class UsersContainer extends Component {
    componentDidMount() {
        this.props.fetchUsers();
        this.props.fetchCurrentUser();
    }

    renderList() {
        console.log(this.props.users)
        // var myPromise = MakeQuerablePromise(this.props.users);
        // if (myPromise === undefined) {
        //     return;
        // } else {
        //     console.log(myPromise)
        // }

        // myPromise.isFulfilled().then(function(data) {
        //     console.log('im here')
        //     return data.map((user) => {
        //         return (
        //         <div key={user.user_id} className="column is-half">
        //             <UserProfile
        //                 id={user.user_id}
        //                 firstname={user.firstname}
        //                 lastname={user.lastname}
        //                 age={user.birth_date}
        //                 src={user.imageProfile_path}
        //             />
        //         </div>
        //         );
        //     });
        // })
        
 

          
               
         
             
                // console.log("Final rejected:", myPromise.isRejected());//false
                // console.log("Final pending:", myPromise.isPending());//false
    
  
       
       


        // var users = await this.props.users;
        // return this.props.users.map((user) => {
        //     return (
        //     <div key={user.user_id} className="column is-half">
        //         <UserProfile
        //             id={user.user_id}
        //             firstname={user.firstname}
        //             lastname={user.lastname}
        //             age={user.birth_date}
        //             src={user.imageProfile_path}
        //         />
        //     </div>
        //     );
        // });
        return (
            'hello'
        )
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
        // users: getFilterUsers(state),
        // users: getMatchedUsers(state),
        users: getMatchedUsers(state),
        loading: state.users.loading,
        currentUser: state.auth.currentUser,
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
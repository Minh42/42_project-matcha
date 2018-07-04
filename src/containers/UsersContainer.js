import React, {Component} from 'react';
import { connect } from 'react-redux';

class UsersContainer extends Component {
    renderList() {
        return this.props.users.map((user) => {
            return (
                <a className="panel-block">{user.name}</a>
            );
        });
    }
    render() {
        return (
            <nav className="panel">
               { this.renderList() }
            </nav>
        )
    }
}

function mapStateToProps(state) {
   return {
        users: state.users
   };
}

export default connect(mapStateToProps)(UsersContainer);
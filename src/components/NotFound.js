import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOutAction } from '../actions/actionUsers';
import { disconnectSocket } from '../actions/actionSocket';
import { bindActionCreators } from 'redux';

class NotFound extends Component {

  componentDidMount() {
    this.props.signOutAction();
    this.props.disconnectSocket();
  }

  render() {
    return (
      <div>
      404 - <Link to="/">Go home</Link>
    </div>
    )
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators({ 
      signOutAction: signOutAction,
      disconnectSocket: disconnectSocket
  }, dispatch);
}

export default connect(null, mapDispatchToProps)(NotFound);
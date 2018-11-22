import React, {Component} from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { resetUsers, fetchUsers } from '../actions/actionFetch';
import { getFilterUsers } from '../selectors/index';
import throttle from 'lodash/throttle';

const withInfiniteScroll = (WrappedComponent) => {
  class HOC extends Component {
    constructor(props) {
      super(props);
      this.state = {
          offset: 0
      };
      this.onScroll = throttle(this.onScroll.bind(this), 50);
    }
    
    componentDidMount() {
      this.props.resetUsers();
      this.props.fetchUsers(this.state.offset);
      window.addEventListener('scroll', this.onScroll, false);
    }

    componentDidUpdate() {
      console.log(this.props.users)
    }
  
    componentWillUnmount() {
      window.removeEventListener('scroll', this.onScroll, false);
    }
  
    onScroll() {
      if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && this.props.users) {
        if (this.props.cancelFetch != 'No more users') {
          this.setState({
            offset: this.state.offset + 20
          })
          this.props.fetchUsers(this.state.offset);
        }
      }
    }

    render() {
      return (
        <WrappedComponent 
          {...this.props}
        />
      ); 
    }
  }

  function mapStateToProps(state) {
    return {
        users: getFilterUsers(state),
        cancelFetch: state.users.cancelFetch
    }
  }

  function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        resetUsers: resetUsers, 
        fetchUsers: fetchUsers
    }, dispatch);
  }

  return connect(mapStateToProps, mapDispatchToProps)(HOC);
}

export default withInfiniteScroll;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { addFlashMessage } from '../src/actions/actionMessages';

export default function(ComposedComponent) {
	class Authenticate extends Component {
		componentWillMount() {
			if(!this.props.isAuthenticated) {
				this.props.addFlashMessage('You need to login to access this page', 'is-danger');
				this.props.history.push('/');
			}
		}

		// componentWillUpdate(nextProps) {
		// 	if (!nextProps.isAuthenticated) {
		// 		this.context.router.push('/');
		// 	}
		// }

		render () {
			return (
				<ComposedComponent {...this.props} />
			);
		}
	}

	// Authenticate.propTypes = {
	// 	isAuthenticated: React.PropTypes.bool.isRequired,
	// 	addFlashMessage: React.Proptypes.func.isRequired
	// }

	// Authenticate.contextTypes = {
	// 	router: React.PropTypes.object.isRequired
	// }

	function mapStateToProps(state) {
		return {
			isAuthenticated: state.auth.authenticated
		};
	}

	function mapDispatchToProps(dispatch) {
		return bindActionCreators({ addFlashMessage: addFlashMessage}, dispatch);
	}

	return withRouter(connect(mapStateToProps, mapDispatchToProps)(Authenticate));
}
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import FlashMessage from './FlashMessage';
import PropTypes from 'prop-types';
import { deleteFlashMessage } from '../actions/actionMessages';
import { TransitionGroup, CSSTransition } from 'react-transition-group'

class FlashMessagesList extends Component {
    render() {
        const messages = this.props.messages.map(message =>
            <FlashMessage key={message.id} message={message} deleteFlashMessage={this.props.deleteFlashMessage}/>
        );
        return (
            <div>
                {messages}
            </div>
        );
    }
}

FlashMessagesList.propTypes = {
	// messages: PropTypes.array.isRequired,
	deleteFlashMessage: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        messages: state.flashMessages
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ deleteFlashMessage: deleteFlashMessage}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FlashMessagesList);
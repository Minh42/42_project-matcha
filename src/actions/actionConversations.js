import * as config from '../constants/websockets';
const { messageTypes } = config;

export function requestMessages(conversationIDs, currentUser) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.requestMessages, {conversationIDs: conversationIDs, currentUser: currentUser});
    };
}


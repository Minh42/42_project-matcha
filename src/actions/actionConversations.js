import * as config from '../constants/websockets';
const { messageTypes } = config;

export function requestMessages(conversationIDs) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.requestMessages, conversationIDs);
    };
}


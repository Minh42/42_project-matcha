import * as config from '../constants/websockets';
const { messageTypes } = config;

export function requestMessages(conversationIDs, currentUser, notifier_socketID) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.requestMessages, {conversationIDs: conversationIDs, currentUser: currentUser, notifier_socketID: notifier_socketID});
    };
}

export function joinRoom(conversationID) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.joinRoom, conversationID);
    };
}

export function sendDirectMessage(conversationID, participantID, directMessage) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.sendDirectMessage, {conversationID: conversationID, participantID: participantID, directMessage: directMessage});
    };
}
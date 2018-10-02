import * as config from '../constants/websockets';
const { messageTypes } = config;

export function joinSocket(user_id) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.joinRequested, user_id);
    };
}

export function sendNotification(notifier_socketID, message) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.sendNotification, {notifier_socketID: notifier_socketID, message: message});
    };
}
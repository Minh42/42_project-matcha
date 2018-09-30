import * as config from '../constants/websockets';
const { messageTypes } = config;

export function joinSocket(user_id) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.joinRequested, user_id);
    };
}

export function sendNotification(notifier_id, message) {
    return (dispatch, getState, {emit}) => {
        console.log(notifier_id);
        console.log(message)
        emit(messageTypes.sendNotification, {notifier_id: notifier_id, message: message});
    };
}
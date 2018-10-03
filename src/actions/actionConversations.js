import * as config from '../constants/websockets';
export const SHOW_CONVERSATION = 'SHOW_CONVERSATION';
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

export function sendDirectMessage(conversationID, participantID, input, conversation) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.sendDirectMessage, {conversationID: conversationID, participantID: participantID, input: input, conversation: conversation});
    };
}


export function showConversation(conversation) {
	return async (dispatch) => {
		dispatch({ 
			type: SHOW_CONVERSATION,
			payload: conversation
		});
	}
}
import * as config from '../constants/websockets';
import axios from 'axios';
export const REQUEST_CONVERSATION = 'REQUEST_CONVERSATION';
export const SHOW_CONVERSATION = 'SHOW_CONVERSATION';
const { messageTypes } = config;

export function requestMessages(conversationIDs, currentUser, notifier_socketID) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.requestMessages, {conversationIDs: conversationIDs, currentUser: currentUser, notifier_socketID: notifier_socketID});
    };
}

export function requestConversations(conversationIDs, currentUser) {
	return async (dispatch) => {

        var conversations_list = [];
        for (var i = 0; i < conversationIDs.length; i++) {
            var res = await axios.post('/api/getConversationsList', { conversation_id: conversationIDs[i].conversation_id })
            var user_id;
            var firstname;
            var lastname;
            var profilePicture;
            currentUser === res.data[0].user_id ? user_id = res.data[1].user_id : user_id = res.data[0].user_id;
            currentUser === res.data[0].user_id ? firstname = res.data[1].firstname : firstname = res.data[0].firstname;
            currentUser === res.data[0].user_id ? lastname = res.data[1].lastname : lastname = res.data[0].lastname;
            currentUser === res.data[0].user_id ? profilePicture = res.data[1].imageProfile_path : profilePicture = res.data[0].imageProfile_path;
            conversations_list.push({
                conversation_id: conversationIDs[i].conversation_id,
                user_id: user_id,
                firstname: firstname,
                lastname: lastname,
                profilePicture: profilePicture
            })
        }
        dispatch({ 
            type: REQUEST_CONVERSATION,
            payload: conversations_list
        });
    }
}

export function joinRoom(conversationID) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.joinRoom, conversationID);
    };
}

export function sendDirectMessage(conversationID, participantID, input, conversations) {
    return (dispatch, getState, {emit}) => {
        emit(messageTypes.sendDirectMessage, {conversationID: conversationID, participantID: participantID, input: input, conversations: conversations});
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
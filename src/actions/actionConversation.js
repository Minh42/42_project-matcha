export const PROFILE_CONVERSATION = 'PROFILE_CONVERSATION';

export function profileConversationAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: PROFILE_CONVERSATION,
				payload: values
			});
		}
	}
}
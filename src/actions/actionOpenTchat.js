export const PROFILE_TCHAT_ID = 'PROFILE_TCHAT_ID';

export function profileTchatAction(values) {
	console.log(values)
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: PROFILE_TCHAT_ID,
				payload: values
			});
		}
	}
}
export const PROFILE_LIKES = 'PROFILE_LIKES';

export function profileLikesAction(values) {
	return (dispatch) => {
		if (values != null) {
			dispatch({ 
				type: PROFILE_LIKES,
				payload: values
			});
		}
	}
}

export function setSocket() {
	return async (dispatch) => {
		const res = await axios.get('/api/current_user');
		if (res.data === 'undefined' || res.data === null || res.data === '' || res.data.length <= 0) {
			dispatch({ 
				type: UNAUTHENTICATED
			});
		}
		else {
			dispatch({ 
				type: AUTHENTICATED,
				payload: res.data
			});
		}
	}
}
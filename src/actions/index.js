import axios from 'axios';

export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';

// const URL = 'http://www.sample-website.com';

export function signInAction({username, password}, history) {
	console.log(username);
	console.log(password);
	// return async (dispatch) => {
	// 	try {
	// 		const res = await axios.post('/signin', {username, password});
			
	// 		dispatch({ type: AUTHENTICATED });
	// 		localStorage.setItem('user', res.data.token);
	// 		history.push('/homepage');
	// 	} catch (error) {
	// 		dispatch({
	// 			type: AUTHENTICATION_ERROR,
	// 			payload: 'Invalid email or password'
	// 		});
	// 	}
	// };
}
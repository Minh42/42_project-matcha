import axios from 'axios';

export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';

export const SIGNUP_ACTION = 'signup_action';

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

export function signUpAction(values){

	const res = axios.post('/api/signup', values);
	console.log(res.data);

	// return {
	// 	type : SIGNUP_ACTION,
	// 	payload : res
	// };
}
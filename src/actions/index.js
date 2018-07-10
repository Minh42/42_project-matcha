import axios from 'axios';
import setAuthorizationToken from '../../library/setAuthorizationToken';

export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';

export const SIGNUP_ACTION = 'signup_action';

// const URL = 'http://www.sample-website.com';

export function signInAction({username, password}, history) {
	return async (dispatch) => {
		try {
			const res = await axios.post('/api/signin', {username, password}).then (res => {
			dispatch({ type: AUTHENTICATED });
			const token = res.data.token;
			localStorage.setItem('jwtToken', token);
			// setAuthorizationToken(token);
			// history.push('/homepage');
			})
		} catch (error) {
			dispatch({
				type: AUTHENTICATION_ERROR,
				payload: 'Invalid email or password'
			});
		}
	};
}

export function signUpAction(values) {
	return async (dispatch) => {
		try {
			const res = await axios.post('/api/signup', values);
			console.log (res.data);
		}
					
		catch (error) {
			dispatch({
				type: AUTHENTICATION_ERROR,
				payload: res
			});
		}
	}
}
import axios from 'axios';

export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';

export const SIGNUP_ACTION = 'signup_action';

// const URL = 'http://www.sample-website.com';

export function signInAction({username, password}, history) {
	return async (dispatch) => {
		try {
			const res = await axios.post('/api/signin', {username, password});
			if(res.data.success) {
				dispatch({ 
					type: AUTHENTICATED 
				});
				localStorage.setItem('user', res.data.token);
				history.push('/homepage');
			}
			if (res.data.error) {
				dispatch({
					type: AUTHENTICATION_ERROR,
					payload: 'Invalid email or password'
				});
			}
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
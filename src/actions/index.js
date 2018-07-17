import axios from 'axios';
// import setAuthorizationToken from '../../library/setAuthorizationToken';

export const AUTHENTICATED = 'authenticated_user';
export const UNAUTHENTICATED = 'unauthenticated_user';
export const AUTHENTICATION_ERROR = 'authentication_error';

export const REGISTERATION_SUCCESS = 'registeration_success';
export const REGISTERATION_ERROR = 'registeration_error';
export const REGISTERATION_FAILED = 'registeration_failed';

// const URL = 'http://www.sample-website.com';

export function signInAction({username, password}, history) {
	return async (dispatch) => {
		try {
			console.log('IM HERE 2');
			const res = await axios.post('/api/signin', {username, password}).then (res => {
			dispatch({ type: AUTHENTICATED });
			const token = res.data.token;
			localStorage.setItem('jwtToken', token);
			// setAuthorizationToken(token);
			console.log(history);
			history.push('/homepage');
			})
		} catch (error) {
			console.log(error);
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
			console.log (res.data.error);
			if (res.data.sucess === true)
			{
				console.log('success');
				dispatch({ 
					type: REGISTERATION_SUCCESS
				});
				// localStorage.setItem('user', res.data.token);
				// history.push('/homepage');
			}
			if (res.data.error !== null)
			{
				console.log('error');
				dispatch({ 
					type: REGISTERATION_ERROR,
					payload : res.data.error
				});
			}
		}		
		catch (error) {
			console.log('failed');
			dispatch({
				type: REGISTERATION_FAILED,
				payload: 'Registeration failed'
			});
		}
	}
}

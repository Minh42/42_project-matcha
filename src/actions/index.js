import axios from 'axios';
import setAuthorizationToken from '../../library/setAuthorizationToken';

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
			const res = await axios.post('/api/signin', {username, password}).then (res => {
			dispatch({ type: AUTHENTICATED });
			const token = res.data.token;
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
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

export function signUpAction(values, history) {
	return async (dispatch) => {
		try {
			const res = await axios.post('/api/signup', values);
			console.log (res.data.error);
			console.log (res.data.success);
			if (res.data.success === "success")
			{
				dispatch({ 
					type: REGISTERATION_SUCCESS,
					payload : res.data.error
				});
				document.getElementById('modalForm').classList.remove("is-active");
				document.getElementById('modalEmail').classList.add("is-active");
				// history.push('/success');
			}
			if (res.data.error !== null)
			{
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

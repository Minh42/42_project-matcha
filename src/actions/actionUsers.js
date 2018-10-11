import axios from 'axios';
import {reset} from 'redux-form';
import setAuthorizationToken from '../../library/setAuthorizationToken';

export const AUTHENTICATED = 'AUTHENTICATED_USER';
export const UNAUTHENTICATED = 'UNAUTHENTICATED_USER';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

export const ONBOARDING = 'ONBOARDING';
export const UNONBOARDING = 'UNONBOARDING';

export const REGISTERATION_SUCCESS = 'REGISTRATION_SUCCESS';
export const REGISTERATION_ERROR = 'REGISTRATION_ERROR';
export const REGISTERATION_FAILED = 'REGISTRATION_FAILED';

export const USER_SELECTED = 'USER_SELECTED';

export function fetchCurrentUser() {
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

export function signInAction({username, password}, history) {
	return async (dispatch) => {
		try {
			const res = await axios.post('/api/signin', {username, password}).then (res => {
			dispatch({ 
				type: AUTHENTICATED
			});
			dispatch(reset('signin'));
			const token = res.data.token;
			localStorage.setItem('jwtToken', token);
			setAuthorizationToken(token);
			document.getElementById('modal_signin').classList.remove("is-active");
			history.push('/onboarding');
			})
		} catch (error) {
			dispatch({
				type: AUTHENTICATION_ERROR,
				payload: 'Invalid email or password'
			});
		}
	};
}

export function signOutAction() {
	return async (dispatch) => {
		localStorage.removeItem('jwtToken');
		setAuthorizationToken(false);
		dispatch({ 
			type: UNAUTHENTICATED,
			payload: null
		})
		await axios.get('/api/signout')
	}
}

export function signUpAction(values, history) {
	return async (dispatch) => {
		try {
			const res = await axios.post('/api/signup', values);
			console.log(res.data.error)
			if (res.data.success === "success")
			{
				dispatch({ 
					type: REGISTERATION_SUCCESS,
					payload : res.data.error
				});
				dispatch(reset('signup'));
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
			if (res.data.error === "Please enter all the informations")
			{
				dispatch({ 
					type: REGISTERATION_ERROR,
					payload : res.data.error
				});
			}
			if (res.data.error === "Your passwords not match")
			{
				dispatch({ 
					type: REGISTERATION_ERROR,
					payload : res.data.error
				});
			}
		}		
		catch (error) {
			dispatch({
				type: REGISTERATION_FAILED,
				payload: 'Registeration failed'
			});
		}
	}
}

export function selectUser(user) {
	return {
		type: USER_SELECTED,
		payload: user
	};
}

export function setOnboarding(){
	return async (dispatch) => {
		dispatch({ 
			type: ONBOARDING
		});
	}
}

export function setUnOnboarding(){
	return async (dispatch) => {
		dispatch({ 
			type: UNONBOARDING
		});
	}
}
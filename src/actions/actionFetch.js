import axios from 'axios';

export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER'
export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export function fetchCurrentUser() {
    return async (dispatch) => {
        const res = await axios.get('/api/current_user');
        dispatch({
            type: FETCH_CURRENT_USER,
            payload: res
        })
    }
}

export function fetchUsers() {
	return async (dispatch) => {
        try {
            dispatch({
                type: FETCH_USERS_REQUEST
            })
            const res = await axios.get('https://randomuser.me/api/?results=10');
            var usersData = res.data.results.map(result => ({
                id: result.registered,
                username: result.login.username,
                age: result.dob.age,
                picture: result.picture.large
            }))
            dispatch({
                type: FETCH_USERS_SUCCESS,
                payload: usersData
            })
        } catch (error) {
            dispatch({
                type: FETCH_USERS_FAILURE,
                payload: error
            });
        }
    }
}

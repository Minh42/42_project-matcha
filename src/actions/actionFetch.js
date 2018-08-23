import axios from 'axios';
import getAge from 'get-age';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';

export function fetchUsers() {
	return async (dispatch) => {
        try {
            dispatch({
                type: FETCH_USERS_REQUEST
            })
            const res = await axios.get('/api/homepage');        
            // var usersData = JSON.stringify(res.data);
            dispatch({
                type: FETCH_USERS_SUCCESS,
                payload: res.data
            })
        } catch (error) {
            dispatch({
                type: FETCH_USERS_FAILURE,
                payload: error
            });
        }
    }
}

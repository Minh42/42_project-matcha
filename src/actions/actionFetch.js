import axios from 'axios';

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

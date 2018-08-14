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
            var usersData = res.data.map(result => ({
                id: result.user_id,
                username: result.username,
                age: result.birth_date,
                picture: result.image_path
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
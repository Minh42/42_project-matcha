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
            console.log('fetching users')
            // const res = await axios.get('/api/homepage');
            // console.log(res.data)
            // var usersData = res.data.map(result => ({
            //     id: data.user_id,
            //     username: data.username,
            //     age: data.birth_date,
            //     picture: result.picture.large
            // }))
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
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
            const res = await axios.get('https://randomuser.me/api/?results=10');
            var usersData = res.data.results.map(result => ({
                id: result.registered,
                firstname: result.name.first,
                lastname: result.name.last,
                age: result.dob.age,
                picture: result.picture.medium
            }))
            console.log(usersData);
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

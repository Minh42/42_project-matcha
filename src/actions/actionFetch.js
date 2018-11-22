import axios from 'axios';

export const FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST';
export const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
export const FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE';
export const FETCH_USERS_CANCEL = 'FETCH_USERS_CANCEL';
export const FETCH_USERS_RESET = 'FETCH_USERS_RESET';

export function fetchUsers(offset) {
	return async (dispatch) => {
        try {
            dispatch({
                type: FETCH_USERS_REQUEST
            })
            console.log(offset)
            if (offset != undefined) {
                const res = await axios.post('/api/homepage', { offset: offset });  
                console.log(res.data) 
                if (res.data.length > 0) {
                    dispatch({
                        type: FETCH_USERS_SUCCESS,
                        payload: res.data
                    })
                } else {
                    dispatch({
                        type: FETCH_USERS_CANCEL,
                        payload: "No more users"
                    }); 
                }
            }

        } catch (error) {
            dispatch({
                type: FETCH_USERS_FAILURE,
                payload: error
            });
        }
    }
}

export function resetUsers() {
	return async (dispatch) => {
        dispatch({
            type: FETCH_USERS_RESET
        });
    }
}
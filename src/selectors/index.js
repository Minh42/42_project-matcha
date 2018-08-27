import { createSelector } from 'reselect';
import { filterByProperty, filterByLikesProfile, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';

const getUsers = (state) => state.users.items
const getCurrentUser = (state) => state.auth.currentUser

export const getAllUsers = createSelector([getUsers], users => {
    return users;
});

export const getLikesUser = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
    console.log(users)
    const user = filterByProperty(users, "user_id", currentUser.user_id)
    const result = filterByLikesProfile(user, users)
    console.log("FINAL", result)
    return result;
})

// export const getMatchedProfiles = createSelector([getAllUsers], users => {

// });

export const getMaeva = createSelector([getAllUsers], users => {
    if (users.length != 0) {
        // console.log(users);
        // const result = match(users[1], users);
        return users;
    } else {
        return users;
    }
});
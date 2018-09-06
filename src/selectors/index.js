import { createSelector } from 'reselect';
import { filterByProperty, filterByLikesProfile, filterByViewsProfile, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';

const getUsers = (state) => state.users.items
const getCurrentUser = (state) => state.auth.currentUser

export const getAllUsers = createSelector([getUsers], users => {
    return users;
});

export const getLikesUsers = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
    const user = filterByProperty(users, "user_id", currentUser.user_id)
    const result = filterByLikesProfile(user, users)
    return result;
})

export const getViewsUsers = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
    const user = filterByProperty(users, "user_id", currentUser.user_id)
    const result = filterByViewsProfile(user, users)
    return result;
})

// export const getMatchedProfiles = createSelector([getAllUsers], users => {

// });


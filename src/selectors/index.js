import { createSelector } from 'reselect'

const getUsers = (state) => state.users.items

export const getAllUsers = createSelector([getUsers], users => {
    return users;
});

// export const getCurrentUser = createSelector([getAllUsers], users => {

// });

// export const getMatchedProfiles = createSelector([getAllUsers], users => {

// });

// export const getAllUsers = createSelector([getUsers], users => {
//     console.log(users);
//     return users.filter(user => user.username.includes('Pauline37'));
// });
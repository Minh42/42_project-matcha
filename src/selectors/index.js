import { createSelector } from 'reselect';
import { filterByProperty, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';

const getUsers = (state) => state.users.items

export const getAllUsers = createSelector([getUsers], users => {
    return users;
});


// export const getMatchedProfiles = createSelector([getAllUsers], users => {

// });

export const getMaeva = createSelector([getAllUsers], users => {
    if (users.length != 0) {

        match(users[0], users);

        const result = filterByProperty(users, "username", "Maeva16");
        return result;
    } else {
        return users;
    }
});
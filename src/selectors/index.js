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
        console.log(users);
        const result = match(users[1], users);
        
        return result;
    } else {
        return users;
    }
});
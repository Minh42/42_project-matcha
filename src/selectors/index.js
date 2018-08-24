import { createSelector } from 'reselect';
import { filterByProperty, filterByLikesProfile, groupByGender, validateInput, getScore } from '../../library/searchFunctions';

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

// export const getMaeva = createSelector([getAllUsers], users => {
//     if (users.length != 0) {
        // var person1 = users[0];
        // var person2 = users[1];
        // var score = getScore(person1, person2);
        // var result = validateInput(users, function(err, data) {
        //     if (err) {
        //         console.log(err);
        //     } else {
        //         console.log(data);
        //     }
        // });
//         const result = filterByProperty(users, "username", "Maeva16");
//         return result;
//     } else {
//         return users;
//     }
// });
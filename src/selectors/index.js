import { createSelector } from 'reselect';
import { removeUserFromArray, filterByProperty, filterByLikesProfile, filterByAge, filterByPopularity, filterByDistance, findAge, sortByAge, findPop, sortByPop, findDistance, sortByDistance, searchTag, deleteTag, filterByViewsProfile, sortByScore, match } from '../../library/searchFunctions';

const getUsers = (state) => state.users.items
const getCurrentUser = (state) => state.auth.currentUser
const getFilter = (state) => state.filterUsers

export const getAllUsers = createSelector([getUsers], users => {
    return users;
});

// export const getAllUsersExceptCurrentUser = createSelector([getAllUsers, getCurrentUser], async (users, currentUser) => {
//     const usersList = await users;
//     const actualUser = await currentUser;
//     const result = await removeUserFromArray(usersList, actualUser.user_id);
//     return result;
// });

export const getAllUsersExceptCurrentUser = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
    const result = removeUserFromArray(users, currentUser.user_id);
    return result;
})

export const getActualUser = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
    const result = filterByProperty(users, "user_id", currentUser.user_id)
    return result;
});

export const getLikesUsers = createSelector([getAllUsersExceptCurrentUser, getCurrentUser], (users, currentUser) => {
    const user = filterByProperty(users, "user_id", currentUser.user_id)
    const result = filterByLikesProfile(user, users)
    return result;
})

export const getViewsUsers = createSelector([getAllUsersExceptCurrentUser, getCurrentUser], (users, currentUser) => {
    const user = filterByProperty(users, "user_id", currentUser.user_id)
    const result = filterByViewsProfile(user, users)
    return result;
});

export const getMatchedUsers = createSelector([getAllUsersExceptCurrentUser, getActualUser], (users, currentUser) => {
    console.log(users)
    console.log(currentUser)
    // var result = match(actual_user, users);
    // console.log('RESULT:', result)
});

// export const getMatchedUsers = createSelector([getAllUsers, getCurrentUser], async (users, currentUser) => {
//     var actualUser = await filterByProperty(users, "user_id", currentUser.user_id);
//     var usersList = await removeUserFromArray(users, currentUser.user_id);
//     console.log(actualUser);

//     var result = await match(actualUser, usersList);
//     var sortedResult = await sortByScore(result);
//     return sortedResult;
// });

export const getFilterUsers = createSelector([getMatchedUsers, getCurrentUser, getFilter], (users, currentUser, filter) => {

    if (filter.ageChange === true) {
        var users = filterByAge(users, "birth_date", filter.ageFilter.min, filter.ageFilter.max)
    }
    if (filter.popularityChange === true) {
        var users = filterByPopularity(users, "popularity", filter.popularityFilter.min, filter.popularityFilter.max)
    }
    if (filter.distanceChange === true) {
        var users = filterByDistance(users, currentUser, filter.distanceFilter.min, filter.distanceFilter.max)
    }
    if (filter.sortbyChange === true) {
        if (filter.sortby === "age") {
            var arrayAge = findAge(users, "birth_date") // on recupere juste les dates d'anniv
            var newArray = arrayAge.sort(); // on trie du plus petit au plus grand
            var newArray = newArray.reverse() // on inverse du plus grand au plus petit
            var users = sortByAge(users, newArray, "birth_date") // on affiche les profils
        }
        else if (filter.sortby === "popularity") {
            var arrayPop = findPop(users, "popularity")
            var newArray = arrayPop.sort();
            var newArray = newArray.reverse()
            var users = sortByPop(users, newArray, "popularity") 
        }
        else if (filter.sortby === "distance") {
            var arrayDistance = findDistance(users, currentUser)
            var newArray = arrayDistance.sort();
            var users = sortByDistance(users, newArray, currentUser) 
        }
    }
    if (filter.searchTag === true && filter.tag.length > 0) {
        var tag = filter.tag
        var users = searchTag(users, tag)
    }
    else if (filter.ageChange === false && filter.distanceChange === false && filter.popularityChange === false && filter.searchTag === false) {
        return users;
    }
    return users;
});
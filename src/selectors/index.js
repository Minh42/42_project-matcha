import { createSelector } from 'reselect';
import { filterByProperty, filterByLikesProfile, filterByAge, filterByPopularity, filterByDistance, findAge, sortByAge, findPop, sortByPop, findDistance, sortByDistance, searchTag, deleteTag, filterByViewsProfile, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';
// import { filterByProperty, filterByLikesProfile, filterByViewsProfile, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';

const getUsers = (state) => state.users.items
const getCurrentUser = (state) => state.auth.currentUser
const getFilter = (state) => state.filterUsers

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
});

export const getFilterUsers = createSelector([getAllUsers, getCurrentUser, getFilter], (users, currentUser, filter) => {
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
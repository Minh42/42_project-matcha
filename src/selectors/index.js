import { createSelector } from 'reselect';
import { AllUsersExceptCurrentUser, filterByProperty, filterByLikesProfile, filterByAge, filterByPopularity, filterByDistance, findAge, sortByAge, findPop, sortByPop, findDistance, sortByDistance, searchTag, filterByViewsProfile, profileWhoMatch, findUserByID, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';
// import { filterByProperty, filterByLikesProfile, filterByViewsProfile, groupByGender, validateInput, getScore, match } from '../../library/searchFunctions';

const getUsers = (state) => state.users.items
const getCurrentUser = (state) => state.auth.currentUser
const getFilter = (state) => state.filterUsers
const getLikes = (state) => state.profileLikes // personnes que le current user a like
const getConversationProfileID = (state) => state.profileConversation // tous les user avec qui le current user a une conversation en cours
const getRemitteeUserID = (state) => state.profileTchatID

export const getAllUsers = createSelector([getUsers], users => {
    return users;
});

export const getCurrentUser1 = createSelector([getCurrentUser], currentUsers => {
    return currentUsers;
});
/*
** les personnes qui ont like le profile actuel
 */
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

export const getAllUsersExceptCurrentUser = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
      const AllUsersExcept = AllUsersExceptCurrentUser(users, currentUser.user_id)
      return AllUsersExcept;
    })
    
export const getActualUser = createSelector([getAllUsers, getCurrentUser], (users, currentUser) => {
    console.log('all1:', users)
    const result = filterByProperty(users, "user_id", currentUser.user_id)
    console.log('actual', result)
    return result;
});
    
export const getMatchedProfiles = createSelector([getAllUsersExceptCurrentUser, getActualUser], (users, actual_user) => {
    console.log(users)
    console.log(actual_user)
    var result = match(actual_user, users);
    console.log('RESULT:', result)
    return result
});

export const getFilterUsers = createSelector([getAllUsers, getCurrentUser, getFilter], (users, currentUser, filter) => {
    console.log(users)
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

// TCHAT/MESSAGES/CONVERSATION

export const getConversationProfileUser = createSelector([getAllUsers, getConversationProfileID], (users, id_users) => {
    if (id_users !== null) {
        var profileUserConvers = findUserByID(users, id_users.profileConversation)
    }
    return profileUserConvers;
})

export const getMatchProfile = createSelector([getLikes, getLikesUsers, getConversationProfileID], (likesByCurrentUser, userWhoLikedMe, id_users) => {
    if (likesByCurrentUser !== null && id_users !== null) {
        var WhoMatch1 = profileWhoMatch(likesByCurrentUser.profileLikes, userWhoLikedMe)
    }
    return WhoMatch1
})

export const getProfileRemittee = createSelector([getAllUsers, getRemitteeUserID], (users, remitteeID) => {
    console.log('users', users)
    console.log(remitteeID)
    if (remitteeID !== null) {
        var remittee = [remitteeID.profileTchatID]
        console.log(remittee[0])
        var profileUserTchat = findUserByID(users, remitteeID.profileTchatID)
    }
    return profileUserTchat;
})
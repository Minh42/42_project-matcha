import { USER_SELECTED } from '../src/actions/actionUsers';

const assert = require('assert');
const empty = require('is-empty');
const isFloat = require('is-float-nodejs');
var getAge = require('get-age');
var turf = require('@turf/turf');
var stemmer = require('stemmer');

function removeUserFromArray(users, user_id) {
    for(var i = users.length; i--;) {
        if (users[i]["user_id"] === user_id) users.splice(i, 1);
    }
    return users;
}

function filterByProperty(array, prop, value) {
    var filtered = new Array();
    array.filter(function (el, index, arr) {
        if (el[prop] === value) {
            filtered.push(el);
        }
    });
    return filtered;
}

function filterByAge(array, prop, min, max) {
    var filtered = new Array();
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        for (var key in obj) {
            var item = getAge(obj[prop]);
            if (item <= max && item >= min) {
                filtered.push(obj);
                break
            }
        }
    }
    return filtered
}

function filterByPopularity(array, prop, min, max) {
    var filtered = new Array();
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        for (var key in obj) {
            var item = obj[prop];
            if (item <= max && item >= min) {
                filtered.push(obj);
                break
            }
        }
    }
    return filtered
}

function filterByDistance(array, currentUser, min, max) {
    var filtered = new Array();
    var latitudeCurrent = currentUser[0].latitude;
    var longitudeCurrent = currentUser[0].longitude;
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        for (var key in obj) {
            var latitudeUser = obj["latitude"];
            var longitudeUser = obj["longitude"]
            var from = turf.point([latitudeCurrent, longitudeCurrent]);
            var to = turf.point([latitudeUser, longitudeUser]);
            var options = {units: 'kilometers'};
            var distance = turf.distance(from, to, options);
            if (distance <= max && distance >= min) {
                filtered.push(obj);
                break
            }
        }
    }
    return filtered
}


//SORT BY AGE

function findAge(array, prop) {
    var age = new Array();
    for (var i = 0; i < array.length; i++) {
        age.push(getAge(array[i][prop]))
    }
    return age
}

function check(filtered, line) {
    var i = 0;
    while (i < filtered.length) 
    {
        if (line.user_id === filtered[i].user_id)
        {
            return true
        }
        i++;
    }
    return false
}

function sortByAge(array, newArray, prop) {
    var filtered = new Array();
    var i = 0;
    while (i < newArray.length) 
    {
        var y = 0;
         while (y < array.length) 
         {
            if (filtered.length != 0 && check(filtered, array[y]) === true) { }
            else if (newArray[i] === getAge(array[y][prop])) {
                filtered.push(array[y])
            }
            y++;
        }
        i++;
    }
    return filtered
}

// SORT BY POPULARITY

function findPop(array, prop) {
    var pop = new Array();
    for (var i = 0; i < array.length; i++) {
        pop.push(array[i][prop])
    }
    return pop
}

function sortByPop(array, newArray, prop) {
    var filtered = new Array();
    var i = 0;
    while (i < newArray.length) 
    {
        var y = 0;
         while (y < array.length) 
         {
            if (filtered.length != 0 && check(filtered, array[y]) === true) { }
            else if (newArray[i] === array[y][prop]) {
                filtered.push(array[y])
            }
            y++;
        }
        i++;
    }
    return filtered
}

// SORT BY DISTANCE

function findDistance(array, currentUser) {
    var arrayDistance = new Array();
    var latitudeCurrent = currentUser[0].latitude;
    var longitudeCurrent = currentUser[0].longitude;
    for (var i = 0; i < array.length; i++) {
        var latitudeUser = array[i].latitude
        var longitudeUser = array[i].longitude
        var from = turf.point([latitudeCurrent, longitudeCurrent]);
        var to = turf.point([latitudeUser, longitudeUser]);
        var options = {units: 'kilometers'};
        var distance = turf.distance(from, to, options);
        arrayDistance.push(distance)
    }
    return arrayDistance
}

function sortByDistance(array, newArray, currentUser) {
    var filtered = new Array();
    var latitudeCurrent = currentUser[0].latitude;
    var longitudeCurrent = currentUser[0].longitude;
    var i = 0;
    while (i < newArray.length) 
    {
        var y = 0;
         while (y < array.length) 
         {
            var latitudeUser = array[y].latitude
            var longitudeUser = array[y].longitude
            var from = turf.point([latitudeCurrent, longitudeCurrent]);
            var to = turf.point([latitudeUser, longitudeUser]);
            var options = {units: 'kilometers'};
            var distance = turf.distance(from, to, options);
            if (filtered.length != 0 && check(filtered, array[y]) === true) { }
            else if (newArray[i] === distance) {
                filtered.push(array[y])
            }
            y++;
        }
        i++;
    }
    return filtered
}

// SORT BY SCORE

function sortByScore(users) {
    var sortedUsers = users.sort(mySorting);
    return sortedUsers;
}

function mySorting(a,b) {
    a = a.score;
    b = b.score;
    return a == b ? 0 : (a < b ? 1 : -1)
}

// SEARCH TAGS

function searchTag(users, tag) {
    var filtered = new Array();
    for (var i = 0; i < users.length; i++) {
        var tags = users[i].tags
        var tagSplit = tags.split(',')
        var bool = 0;
        for (var k = 0; k < tag.length; k++) {
            for (var y = 0; y < tagSplit.length; y++) {
                if (tagSplit[y] === tag[k].text) {
                    if (k + 1 === tag.length && k === bool) {
                        filtered.push(users[i])
                    }
                    bool++
                    break;
                }
            }
        }
    }
    return filtered
}

// trouver Users by ID

function findUserByID(users, id_users) {
    var userConversation = new Array();
    if (id_users.length > 0) {
        for (var y = 0; y < id_users.length; y++) {
            for (var i = 0; i < users.length; i++) {
                if (id_users[y] === users[i].user_id) {
                    userConversation.push(users[i])
                }
            }
        }
    } else {
        for (var i = 0; i < users.length; i++) {
            if (id_users === users[i].user_id) {
                userConversation.push(users[i])
            }
        }
    } 
    return userConversation
}


// ALGO MATCHING

function match(user, users) {
    var scoring_list = new Array();
    const res = validateInput(users, function(err, data) {
        if (err) {
            console.log(err);
        } 
    });

    // split by groups
    const groups = groupByGender(users);
    var men = groups["men"];
    var women = groups["women"];
    var both = groups["both"];

    if (user[0].genders === "man") {
        for (var i = 0; i < men.length; i++) {
            var value = Object.assign(men[i], {"score": getScore(user, men[i], users)})
            scoring_list.push(value);
        }
    } else if (user[0].genders === "woman") {
        for (var j = 0; j < women.length; j++) {
            // var value = women[j];
            var value = Object.assign(women[j], {"score": getScore(user, women[j], users)})
            scoring_list.push(value);
        }
    } else {
        for (var k = 0; k < both.length; k++) {
            var value = Object.assign(both[k], {"score": getScore(user, both[k], users)})
            scoring_list.push(value);
        }
    }
    return scoring_list;
}

function getScore(person1, person2, users) {
    const weights =  {
        "interests": 0.3,
        "popularity": 0.2,
        "age": 0.1,
        "coordinates": 0.4
    }
    var score = 0.0;
    var interest_list1 = person1[0].tags.split(',');
    var interest_list2 = person2["tags"].split(',');

    for (var i = 0; i < interest_list1.length; i++) {
        for (var j = 0; j < interest_list2.length; j++) {
            var stem1 = stemmer(interest_list1[i].toLowerCase());
            var stem2 = stemmer(interest_list2[j].toLowerCase());
            if (stem1 === stem2) {
                score += Math.round(20 * weights["interests"]);
            }
        }
    }

    var max_age = Math.max(...users.map(elt => getAge(elt.birth_date)));
    var min_age = Math.min(...users.map(elt => getAge(elt.birth_date)));
    if (person1[0].birth_date && person2["birth_date"]) {
        var age1 = getAge(person1[0].birth_date);
        var age2 = getAge(person2["birth_date"]);
        score += Math.round((100 - (Math.abs(age1 - age2) * 100 / (max_age - min_age))) * weights["age"]);
    }

    var max_popularity = Math.max(...users.map(elt => elt.popularity));
    var min_popularity = Math.min(...users.map(elt => elt.popularity));

    if (person1[0].popularity && person2["popularity"]) {
        var popularity1 = person1[0].popularity;
        var popularity2 = person2["popularity"];
        score += Math.round((100 - (Math.abs(popularity1 - popularity2) * 100 / (max_popularity - min_popularity))) * weights["popularity"]);
    }

    var distance_array = new Array();
    for (var k = 0; k < users.length; k++) {
        var lon1 = person1[0].longitude;
        var lat1 = person1[0].latitude;
        var from = turf.point([lon1, lat1]);
        var lon2 = users[k]["longitude"];
        var lat2 = users[k]["latitude"];
        var to = turf.point([lon2, lat2]);

        var options = {units: 'kilometers'};
        var distance = turf.distance(from, to, options);
        distance_array.push(distance);
    }

    var max_distance = Math.max(...distance_array);
    var min_distance = Math.min(...distance_array);

    if (person1[0].longitude && person1[0].latitude && person2["longitude"] && person2["latitude"]) {
        var lon1 = person1[0].longitude;
        var lat1 = person1[0].latitude;
        var lon2 = person2["longitude"];
        var lat2 = person2["latitude"];

        var from = turf.point([lon1, lat1]);
        var to = turf.point([lon2, lat2]);
        var options = {units: 'kilometers'};
        var distance = turf.distance(from, to, options);
        score += Math.round((100 - (distance * 100 / (max_distance - min_distance))) * weights["coordinates"]);
    }
    return score;
}

function multiFilter(users, filters){
    const filterKeys = Object.keys(filters); // return "user_id"
    return users.filter(eachObj => {
      return filterKeys.every(eachKey => {
        if (!filters[eachKey].length) {
          return true; // passing an empty filter means that filter is ignored.
        }
        return filters[eachKey].includes(eachObj[eachKey]);
      });
    });
  };

function filterBlockedUsers(user, users) {
    if (user[0].usersBlockedByMe != null) {
        var usersBlockedByMe = user[0].usersBlockedByMe.split(',');
        for (var i = 0; i < users.length; i++) {
            for (var j = 0; j < usersBlockedByMe.length; j++) {
                if (users[i]["user_id"] == usersBlockedByMe[j]) {
                    users.splice(i, 1);
                  }
            }
        }
        return users;
    } else {
        return users;
    }     
}

function filterByLikesProfile(user, users) {
    if (user[0].usersWholikedMe !=  null) {
        var likedByUsers = user[0].usersWholikedMe.split(',');
        var likes = []
        likedByUsers.forEach(function(elt) {
            var item = parseInt(elt)
            likes.push(item)
        })

        let filters = {
            user_id: likes
        };

        var filtered = multiFilter(users, filters);
        return filtered;
    } else {
        return null;
    }
}

function filterByViewsProfile(user, users) {
    if (user[0].views !=  null) {
        var viewedByUsers = user[0].views.split(',');
        var views = []
        viewedByUsers.forEach(function(elt) {
            var item = parseInt(elt)
            views.push(item)
        })

        let filters = {
            user_id: views
        };

        var filtered = multiFilter(users, filters);
        return filtered;
    } else {
        return null;
    }
}

async function validateInput(users, callback) {
    assert.strictEqual(typeof (users), 'object', "argument 'users' must be a string");
    assert.strictEqual(typeof (callback), 'function');

    const groups = groupByGender(users);
    var men = groups["men"];
    var women = groups["women"];
    var both = groups["both"];

    // check if arrays are empty or null
    if ((!Array.isArray(men) || !men.length) && (!Array.isArray(women) || !women.length) && (!Array.isArray(both) || !both.length)) {
        // callback(new Error('Please provide groups by gender'));
        return false;
    }
    else if (!Array.isArray(men) || !men.length) {
        // callback(new Error('Please provide the male group'));
        return false; 
    } else if (!Array.isArray(women) || !women.length) {
        // callback(new Error('Please provide the female group'));
        return false;
    } else if (!Array.isArray(both) || !both.length) {
        // callback(new Error('Please provide male and female group'));   
        return false;
    }
  
    // check if keys exist in arrays
    for (var i = 0; i < men.length; i++) {
        if (Object.keys(men[i]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            // callback(new Error('Please provide required fields for all men')); 
            return false;
        }
    }

    for (var j = 0; j < women.length; j++) {
        if (Object.keys(women[j]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            // callback(new Error('Please provide required fields for all women'));
            return false; 
        }
    }

    for (var k = 0; k < both.length; k++) {
        if (Object.keys(both[k]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            // callback(new Error('Please provide required fields for all people')); 
            return false;
        }
    }

    // check data validity for each field
    for (var i = 0; i < men.length; i++) {
        if (empty(men[i]["user_id"]) || empty(men[i]["gender"]) || empty(men[i]["tags"]) || empty(men[i]["popularity"]) 
        || empty(men[i]["birth_date"]) || empty(men[i]["longitude"]) || empty(men[i]["latitude"])) {
            // callback(new Error('Please provide valid data for all men')); 
            return false;
        } else if (!Array.isArray(men[i]["tags"].split(',')) || !men[i]["tags"].length) {
            // callback(new Error("Please provide a list of interests for each person."));  
            return false;
        } else if (!isFloat(men[i]["longitude"]) || !isFloat(men[i]["latitude"])) {
            // callback(new Error("Coordinate values can only be in float."));
            return false;
        }
        else {
            continue;
        }
    }

    for (var j = 0; j < women.length; j++) {
        if (empty(women[j]["user_id"]) || empty(women[j]["gender"]) || empty(women[j]["tags"]) || empty(women[j]["popularity"]) 
        || empty(women[j]["birth_date"]) || empty(women[j]["longitude"]) || empty(women[j]["latitude"])) {
            // callback(new Error('Please provide valid data for all women')); 
            return false;
        } else if (!Array.isArray(women[j]["tags"].split(',')) || !women[j]["tags"].length) {
            // callback(new Error("Please provide a list of interests for each person."));  
            return false;
        } else if (!isFloat(women[j]["longitude"]) || !isFloat(women[j]["latitude"])) {
            // callback(new Error("Coordinate values can only be in float."));
            return false;
        }
        else {
            continue;
        }
    }

    for (var k = 0; k < both.length; k++) {
        if (empty(both[k]["user_id"]) || empty(both[k]["gender"]) || empty(both[k]["tags"]) || empty(both[k]["popularity"]) 
        || empty(both[k]["birth_date"]) || empty(both[k]["longitude"]) || empty(both[k]["latitude"])) {
            // callback(new Error('Please provide valid data for all men')); 
            return false;
        } else if (!Array.isArray(both[k]["tags"].split(',')) || !both[k]["tags"].length) {
            // callback(new Error("Please provide a list of interests for each person."));
            return false;
        } else if (!isFloat(both[k]["longitude"]) || !isFloat(both[k]["latitude"])) {
            // callback(new Error("Coordinate values can only be in float."));
            return false;
        }
        else {
            continue;
        }
    }
    return true;
}

function groupByGender(users) {
    var men = filterByProperty(users, "gender", "man");
    var women = filterByProperty(users, "gender", "woman");
    var both = users;

    const groups = {
        men: men,
        women: women,
        both: both
    };

    if ((men.length + women.length) === both.length) {
        return groups;
    }
}

// PROFILE WHO MATCH

function profileWhoMatch(currentUser, users) {
    if (currentUser[0].usersLikedByMe != null) {
        var usersLikedByMe = currentUser[0].usersLikedByMe.split(',');
        var match = new Array();
        for (var i = 0; i < usersLikedByMe.length; i++) {
            for (var y = 0; y < users.length; y++) {
                if (parseInt(usersLikedByMe[i]) === users[y].user_id)
                {
                    match.push(users[y]);
                }
            }
        }
        return match;
    }
    else 
        return;
}

function checkUserConversation(conversationUserID, id_user) {
    for (var i = 0; i < conversationUserID.profileConversation.length; i++) {
        if (conversationUserID.profileConversation[i] === id_user.id_user_match) {
            return true;
        }
    }
    return false
}



function AllUsersExceptCurrentUser(users, currentUserID) {
    var usersExceptCurrent = new Array();
    for (var i = 0; i < users.length; i++) {
        if (users[i].user_id !== currentUserID) {
            usersExceptCurrent.push(users[i])
        }
    }
    return usersExceptCurrent
}

module.exports = {
    filterByProperty : filterByProperty,
    filterByLikesProfile: filterByLikesProfile,
    filterByAge: filterByAge,
    filterByPopularity: filterByPopularity,
    filterByDistance: filterByDistance,
    filterBlockedUsers: filterBlockedUsers,
    findAge: findAge,
    sortByAge: sortByAge,
    findPop: findPop,
    sortByPop: sortByPop,
    findDistance: findDistance,
    sortByDistance: sortByDistance,
    searchTag: searchTag,
    filterByViewsProfile: filterByViewsProfile,
    checkUserConversation : checkUserConversation,
    groupByGender: groupByGender,
    findUserByID: findUserByID,
    validateInput: validateInput,
    getScore : getScore,
    match: match,
    removeUserFromArray: removeUserFromArray,
    sortByScore: sortByScore,
    profileWhoMatch: profileWhoMatch,
    AllUsersExceptCurrentUser : AllUsersExceptCurrentUser 
}
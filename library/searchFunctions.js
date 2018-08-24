const assert = require('assert');
const empty = require('is-empty');
const isFloat = require('is-float-nodejs');

function filterByProperty(array, prop, value) {
    var filtered = new Array();
    for (var i = 0; i < array.length; i++) {
        var obj = array[i];
        for (var key in obj) {
            var item = obj[prop];
            if (item === value) {
                filtered.push(obj);
                break;
            }
        }
    } 
    return filtered;
}

function match(user, users) {
    var scoring_list = new Array();
    const res = validateInput(users, function(err, data) {
        if (err) {
            console.log(err);
        } 
    });

    // split by groups
    var groups = groupByGender(users);
    var men = groups["men"];
    var women = groups["women"];
    var both = groups["both"];

    if (user["interested_in"] === "man") {
        for (var i = 0; i < men.length; i++) {
            var value = Object.assign({"user_id": men[i]["user_id"], "score": getScore(user, men[i], users)})
            scoring_list.push(value);
        }
    } else if (user["interested_in"] === "woman") {
        for (var j = 0; j < women.length; j++) {
            var value = Object.assign({"user_id": women[j]["user_id"], "score": getScore(user, women[j], users)})
            scoring_list.push(value);
        }
    } else {
        for (var k = 0; k < both.length; k++) {
            var value = Object.assign({"user_id": both[k]["user_id"], "score": getScore(user, both[k], users)})
            scoring_list.push(value);
        }
    }
    console.log(scoring_list)
    return scoring_list;
}

function getScore(person1, person2, users) {
    const weights =  {
        "interests": 0.3,
        "popularity": 0.2,
        "age": 0.1,
        "coordinates": 0.4
    }
    var stemmer = require('stemmer');
    var getAge = require('get-age');
    var turf = require('@turf/turf');
    var score = 0.0;

    var interest_list1 = person1["tags"].split(',');
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
    if (person1["birth_date"] && person2["birth_date"]) {
        var age1 = getAge(person1["birth_date"]);
        var age2 = getAge(person2["birth_date"]);
        score += Math.round((100 - (Math.abs(age1 - age2) * 100 / (max_age - min_age))) * weights["age"]);
    }

    var max_popularity = Math.max(...users.map(elt => elt.popularity));
    var min_popularity = Math.min(...users.map(elt => elt.popularity));

    if (person1["popularity"] && person2["popularity"]) {
        var popularity1 = person1["popularity"];
        var popularity2 = person2["popularity"];
        score += Math.round((100 - (Math.abs(popularity1 - popularity2) * 100 / (max_popularity - min_popularity))) * weights["popularity"]);
    }

    var distance_array = new Array();
    for (var k = 0; k < users.length; k++) {
        var lon1 = person1["longitude"];
        var lat1 = person1["latitude"];
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

    if (person1["longitude"] && person1["latitude"] && person2["longitude"] && person2["latitude"]) {
        var lon1 = person1["longitude"];
        var lat1 = person1["latitude"];
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

function validateInput(users, callback) {
    assert.strictEqual(typeof (users), 'object', "argument 'users' must be a string");
    assert.strictEqual(typeof (callback), 'function');

    var groups = groupByGender(users);
    var men = groups["men"];
    var women = groups["women"];
    var both = groups["both"];
   
    // check if arrays are empty or null
    if ((!Array.isArray(men) || !men.length) && (!Array.isArray(women) || !women.length) && (!Array.isArray(both) || !both.length)) {
        callback(new Error('Please provide groups by gender'));
        return false;
    }
    else if (!Array.isArray(men) || !men.length) {
        callback(new Error('Please provide the male group'));
        return false; 
    } else if (!Array.isArray(women) || !women.length) {
        callback(new Error('Please provide the female group'));
        return false;
    } else if (!Array.isArray(both) || !both.length) {
        callback(new Error('Please provide male and female group'));   
        return false;
    }
  
    // check if keys exist in arrays
    for (var i = 0; i < men.length; i++) {
        if (Object.keys(men[i]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            callback(new Error('Please provide required fields for all men')); 
            return false;
        }
    }

    for (var j = 0; j < women.length; j++) {
        if (Object.keys(women[j]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            callback(new Error('Please provide required fields for all women'));
            return false; 
        }
    }

    for (var k = 0; k < both.length; k++) {
        if (Object.keys(both[k]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            callback(new Error('Please provide required fields for all people')); 
            return false;
        }
    }

    // check data validity for each field
    for (var i = 0; i < men.length; i++) {
        if (empty(men[i]["user_id"]) || empty(men[i]["gender"]) || empty(men[i]["tags"]) || empty(men[i]["popularity"]) 
        || empty(men[i]["birth_date"]) || empty(men[i]["longitude"]) || empty(men[i]["latitude"])) {
            callback(new Error('Please provide valid data for all men')); 
            return false;
        } else if (!Array.isArray(men[i]["tags"].split(',')) || !men[i]["tags"].length) {
            callback(new Error("Please provide a list of interests for each person."));  
            return false;
        } else if (!isFloat(men[i]["longitude"]) || !isFloat(men[i]["latitude"])) {
            callback(new Error("Coordinate values can only be in float."));
            return false;
        }
        else {
            continue;
        }
    }

    for (var j = 0; j < women.length; j++) {
        if (empty(women[j]["user_id"]) || empty(women[j]["gender"]) || empty(women[j]["tags"]) || empty(women[j]["popularity"]) 
        || empty(women[j]["birth_date"]) || empty(women[j]["longitude"]) || empty(women[j]["latitude"])) {
            callback(new Error('Please provide valid data for all men')); 
            return false;
        } else if (!Array.isArray(women[j]["tags"].split(',')) || !women[j]["tags"].length) {
            callback(new Error("Please provide a list of interests for each person."));  
            return false;
        } else if (!isFloat(women[j]["longitude"]) || !isFloat(women[j]["latitude"])) {
            callback(new Error("Coordinate values can only be in float."));
            return false;
        }
        else {
            continue;
        }
    }

    for (var k = 0; k < both.length; k++) {
        if (empty(both[k]["user_id"]) || empty(both[k]["gender"]) || empty(both[k]["tags"]) || empty(both[k]["popularity"]) 
        || empty(both[k]["birth_date"]) || empty(both[k]["longitude"]) || empty(both[k]["latitude"])) {
            callback(new Error('Please provide valid data for all men')); 
            return false;
        } else if (!Array.isArray(both[k]["tags"].split(',')) || !both[k]["tags"].length) {
            callback(new Error("Please provide a list of interests for each person."));
            return false;
        } else if (!isFloat(both[k]["longitude"]) || !isFloat(both[k]["latitude"])) {
            callback(new Error("Coordinate values can only be in float."));
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

module.exports = {
    filterByProperty : filterByProperty,
    groupByGender: groupByGender,
    validateInput: validateInput,
    getScore : getScore,
    match: match
}
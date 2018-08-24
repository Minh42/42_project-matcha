const assert = require('assert');
const empty = require('is-empty');

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

function filterByLikesProfile(user, users) {

    var likedByUsers = user[0].likes.split(',');
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
}

function validateInput(users, callback) {
    assert.strictEqual(typeof (users), 'object', "argument 'users' must be a string");
    assert.strictEqual(typeof (callback), 'function');

    var groups = groupByGender(users);
    console.log(groups)
    var men = groups["men"];
    var women = groups["women"];
    var both = groups["both"];
   
    // check if arrays are empty or null
    if ((!Array.isArray(men) || !men.length) && (!Array.isArray(women) || !women.length) && (!Array.isArray(both) || !both.length)) {
        callback(new Error('Please provide groups by gender'));
    }
    else if (!Array.isArray(men) || !men.length) {
        callback(new Error('Please provide the male group'));  
    } else if (!Array.isArray(women) || !women.length) {
        callback(new Error('Please provide the female group')); 
    } else if (!Array.isArray(both) || !both.length) {
        callback(new Error('Please provide male and female group'));   
    }

    // check if keys exist in arrays
    for (var i = 0; i < men.length; i++) {
        if (Object.keys(men[i]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            callback(new Error('Please provide required fields for all men')); 
        }
    }

    for (var j = 0; j < women.length; j++) {
        if (Object.keys(women[j]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            callback(new Error('Please provide required fields for all women')); 
        }
    }

    for (var k = 0; k < both.length; k++) {
        if (Object.keys(both[k]).includes("user_id", "gender", "tags", "popularity", "birth_date", "longitude", "latitude")) {
            continue;
        } else {
            callback(new Error('Please provide required fields for all people')); 
        }
    }

    // check data validity for each field
    for (var i = 0; i < men.length; i++) {
        if (empty(men[i]["user_id"]) || empty(men[i]["gender"]) || empty(men[i]["tags"]) || empty(men[i]["popularity"]) 
        || empty(men[i]["birth_date"]) || empty(men[i]["longitude"]) || empty(men[i]["latitude"])) {
            callback(new Error('Please provide valid data for all men')); 
        } else if (!Array.isArray(men[i]["tags"]) || !men[i]["tags"].length) {
            callback(new Error("Please provide a list of interests for each person."));  
        }
        else {
            continue;
        }
    }

    for (var j = 0; j < women.length; j++) {
        if (empty(women[j]["user_id"]) || empty(women[j]["gender"]) || empty(women[j]["tags"]) || empty(women[j]["popularity"]) 
        || empty(women[j]["birth_date"]) || empty(women[j]["longitude"]) || empty(women[j]["latitude"])) {
            callback(new Error('Please provide valid data for all men')); 
        } else if (!Array.isArray(women[j]["tags"]) || !women[j]["tags"].length) {
            callback(new Error("Please provide a list of interests for each person."));  
        }
        else {
            continue;
        }
    }

    for (var k = 0; k < both.length; k++) {
        if (empty(both[k]["user_id"]) || empty(both[k]["gender"]) || empty(both[k]["tags"]) || empty(both[k]["popularity"]) 
        || empty(both[k]["birth_date"]) || empty(both[k]["longitude"]) || empty(both[k]["latitude"])) {
            callback(new Error('Please provide valid data for all men')); 
        } else if (!Array.isArray(both[k]["tags"]) || !both[k]["tags"].length) {
            callback(new Error("Please provide a list of interests for each person."));
        }
        else {
            continue;
        }
    }

    console.log('I CAME ALL THE WAY HERE')

    //         if not isinstance(person["interests"], list):
    //             raise AlgorithmError("Please provide a list of interests for each person.")
                
    //         # Check validity for the longitude and latitude if the coordinates field exists
    //         if "coordinates" in person:
    //             if not isinstance(person["coordinates"], dict):
    //                 raise AlgorithmError("Please provide valid coordinates")
    //             if "lat" not in person["coordinates"] or "long" not in person["coordinates"]:
    //                 raise AlgorithmError("Please provide valid coordinates")
    //             if not isinstance(person["coordinates"]["lat"], float) or not isinstance(person["coordinates"]["long"], float):
    //                 raise AlgorithmError("coordinate values can only be in float.")




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

function getScore(person1, person2) {
    const weights =  {
        "interests": 1.0,
        "popularity": 5.0,
        "age": 0.5,
        "coordinates": 0.005
    }
    var stemmer = require('stemmer');
    var getAge = require('get-age');
    var turf = require('@turf/turf');
    var score = 0.0;

    var interest_list1 = person1["tags"].split(',');
    var interest_list2 = person2["tags"].split(',');

    for (var i = 0; i < interest_list1.length; i++) {
        for (var j = 0; j < interest_list2 .length; j++) {
            var stem1 = stemmer(interest_list1[i].toLowerCase());
            var stem2 = stemmer(interest_list2[j].toLowerCase());
            if (stem1 === stem2) {
                score += weights["interests"];
            }
        }
    }

    if (person1["birth_date"] && person2["birth_date"]) {
        var age1 = getAge(person1["birth_date"]);
        var age2 = getAge(person2["birth_date"]);
        score -= Math.abs(age1 - age2) * weights["age"];
    }

    if (person1["popularity"] && person2["popularity"]) {
        var popularity1 = person1["popularity"];
        var popularity2 = person2["popularity"];
        score -= Math.abs(popularity1 - popularity2) * weights["popularity"];
    }

    if (person1["longitude"] && person1["latitude"] && person2["longitude"] && person2["latitude"]) {
        var lon1 = person1["longitude"];
        var lat1 = person1["latitude"];
        var lon2 = person2["longitude"];
        var lat2 = person2["latitude"];

        var from = turf.point([lon1, lat1]);
        var to = turf.point([lon2, lat2]);
        var options = {units: 'kilometers'};
        var distance = turf.distance(from, to, options);
        score -= distance * weights["coordinates"];
    }

    return score;
}

module.exports = {
    filterByProperty : filterByProperty,
    filterByLikesProfile: filterByLikesProfile,
    groupByGender: groupByGender,
    validateInput: validateInput,
    getScore : getScore
}
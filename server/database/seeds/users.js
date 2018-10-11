var faker = require('faker/locale/fr');
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const gender = require('gender');
const randomLocation = require('random-location');
const keys = require('../../config/keys');
const cloudinary = require('cloudinary');
const shuffle = require('shuffle-array');

function pickRand(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function pickPhoto(photos) {
	return photos.length 
		? photos.pop().secure_url  
		: 'https://bulma.io/images/placeholders/128x128.png';	
}

let createUser = (knex, id, bio, occupations, female, male) => {
    const P = { latitude: 48.861014, longitude: 2.341155 }; // Paris center
    const R = 1000 * 30; // within a circle of 30 km
    const { latitude, longitude } = randomLocation.randomCirclePoint(P, R);
    const identity = faker.helpers.userCard();
    var arrayName = identity.name.split(' ');
    var firstname = arrayName[0];
    var lastname = arrayName[1];
	const guessedGender = gender.guess(identity.name).gender == 'male' ? 'man' : 'woman';

  return {
    firstname: firstname,
    lastname: lastname,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: '$2a$10$OePpGWRH/wbUg9oIaW860Oi1dBLcZIUjUZUivQ0iBfV2YMizy2k0q',
    activation_code: null,
    status: 1,
    birth_date: faker.date.between('1977-01-01', '2000-01-01'),
    gender: guessedGender,
    latitude: latitude,
    longitude: longitude,
    bio: pickRand(bio),
    imageProfile_path: pickPhoto(guessedGender == 'man' ? male : female),
    occupation: pickRand(occupations),
    ip_address: faker.internet.ip(),
    geolocalisationAllowed: true,
    onboardingDone: true,
    popularity: getRandomIntInclusive(1, 100),
    fb_id: null,
    google_id: null,
    token_reset: null,
    alert_notification: true,
    date_created: new Date(),
    date_updated: new Date()
  }
}

let createUserPhoto = (knex, id) => {
    return {
        user_id: id,
        details: null,
        image_path: null,
        active: true,
        date_created: new Date(),
        date_updated: new Date()
    }
}

let createUserTag = (knex, id) => {
    return {
        user_id: id,
        tag_id: getRandomIntInclusive(1, 25)
    }
}

let createUserGenderInterest = (knex, id) => {
    return {
        user_id: id,
        gender_id: getRandomIntInclusive(1, 3),
    }
}

let createUserRelationshipInterest = (knex, id) => {
    return {
        user_id: id,
        relationship_type_id: getRandomIntInclusive(1, 6),
    }
}

async function getCloudinaryPhotos(gender) {
    cloudinary.config({ 
        cloud_name: keys.CLOUD_NAME, 
        api_key: keys.CLOUDINARY_API_KEY,
        api_secret: keys.CLOUDINARY_API_SECRET
    });

    try {
        const res = await cloudinary.v2.api.resources({ type: 'upload', prefix: 'matcha/' + gender + '/', max_results: 550 });
        const photos = res.resources;
        return photos;
    } catch(e) {
        console.log(e);
    }


}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
    return knex('interested_in_relation').del()
        .then(() => {
            return knex('interested_in_gender').del()
        })
        .then(() => {
            return knex('user_tags').del();
        })
        .then(() => {
            return knex('user_photos').del();
        })
        .then(() => {
            return knex('users').del();
        })
        .then(async function () {
        //Inserts seed entries
            let users = [];

            async function getData() {
                const bioPromise = readFile('./seeds/bio', 'ascii');
                const occupationsPromise = readFile('./seeds/occupations', 'ascii');
                const femalePromise = getCloudinaryPhotos('female');
                const malePromise = getCloudinaryPhotos('male');

                const [bioJSON, occupationsJSON, femaleJSON, maleJSON] = await Promise.all([bioPromise, occupationsPromise, femalePromise, malePromise]);
                const customData = {
                    bio: JSON.parse(bioJSON),
                    occupations: JSON.parse(occupationsJSON),
                    female: shuffle(femaleJSON),
                    male: shuffle(maleJSON)
                };
                return customData;
            }
    
            var promise = await getData();
            const { bio, occupations, female, male } = promise;
            for (let id = 1; id <= 500; id++) {
                users.push(createUser(knex, id, bio, occupations, female, male))
            }
            return knex("users").insert(users);
        })
        .then(function () {
            let usersPhotos = [];
            for (let id = 1; id <= 500; id++) {
                for (var i = 0; i < 1; i++) {
                    usersPhotos.push(createUserPhoto(knex, id))
                }
            }
            return knex("user_photos").insert(usersPhotos);
        })
        .then(() => {
            let usersTags = [];
            for (let id = 1; id <= 500; id++) {
                for (var i = 0; i < 5; i++) {
                    usersTags.push(createUserTag(knex, id))
                }
            }
            return knex("user_tags").insert(usersTags);
        })
        .then(() => {
            let usersGenderInterest = [];
            for (let id = 1; id <= 500; id++) {
                usersGenderInterest.push(createUserGenderInterest(knex, id))
            }
            return knex("interested_in_gender").insert(usersGenderInterest);
        })
        .then(() => {
            let usersRelationshipInterest = [];
            for (let id = 1; id <= 500; id++) {
                usersRelationshipInterest.push(createUserRelationshipInterest(knex, id))
            }
            return knex("interested_in_relation").insert(usersRelationshipInterest);
        })
};
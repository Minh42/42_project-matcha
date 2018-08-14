var faker = require('faker/locale/fr');
const axios = require('axios');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const gender = require('gender');
const randomLocation = require('random-location');

function pickRand(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

let createUser = (knex, id, bio, occupations) => {

  const P = { latitude: 48.861014, longitude: 2.341155 }; // Paris center
  const R = 1000 * 30; // within a circle of 30 km
  const { latitude, longitude } = randomLocation.randomCirclePoint(P, R);
  const identity = faker.helpers.userCard();
  var arrayName = identity.name.split(' ');
  var firstname = arrayName[0];
  var lastname = arrayName[1];
	const guessedGender = gender.guess(identity.name).gender == 'male' ? 'man' : 'woman';

  return knex('users')
  .returning('user_id')
  .insert({
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
    occupation: pickRand(occupations),
    ip_address: faker.internet.ip(),
    geolocalisationAllowed: true,
    onboardingDone: false,
    popularity: Math.floor(Math.random() * 100),
    fb_id: null,
    google_id: null,
    token_reset: null,
    alert_notification: true,
    date_created: new Date(),
    date_updated: new Date()
  })
  .then(function(id) { 
    for (var i = 0; i < 5; i++) {
      knex.transaction(trx => {
        return trx('user_photos')
        .returning('user_id')
        .insert({
          user_id: id,
          details: null,
          image_path: faker.image.imageUrl(640, 480, "people"),
          active: true,
          date_created: new Date(),
          date_updated: new Date()
        })
      })
    }
  })
  .then(function(id) {
    for (var i = 0; i < 5; i++) {
      knex.transaction(trx => {
        return trx('user_tags')
          .returning('user_id')
          .insert({
            user_id: id,
            tag_id: getRandomIntInclusive(1, 25)
        })
      })
    }
  })
  .then(function(id) {
    return knex('interested_in_gender')
    .returning('user_id')
    .insert({
      user_id: id,
      gender_id: getRandomIntInclusive(1, 3),
    })
  })
  .then(function(id) {
    return knex('interested_in_relation')
    .returning('user_id')
    .insert({
      user_id: id,
      relationship_type_id: getRandomIntInclusive(1, 6),
    })
  })
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('interested_in_relation').del()
    .then(() => {
      return knex('interested_in_gender').del()
    })
    .then(() => {
      return knex('user_tags').del()
    })
    .then(() => {
      return knex('user_photos').del()
    })
    .then(() => {
      return knex('users')
      .del()
      .then(async function () {
      //Inserts seed entries
      let users = [];

      async function getData() {
        const bioPromise = readFile('./seeds/bio', 'ascii');
        const occupationsPromise = readFile('./seeds/occupations', 'ascii');
      
        const [bioJSON, occupationsJSON] = await Promise.all([bioPromise, occupationsPromise]);
        const customData = {
          bio: JSON.parse(bioJSON),
          occupations: JSON.parse(occupationsJSON)
        };
        return customData;
      }
    
      var promise = await getData();
      const { bio, occupations } = promise;
      for (let id = 1; id <= 10; id++) {
        users.push(createUser(knex, id, bio, occupations))
      }

      return Promise.all(users);
    });
  })
};

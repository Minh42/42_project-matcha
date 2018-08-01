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

let createUser = (knex, id, bio, occupations) => {

  const P = { latitude: 48.861014, longitude: 2.341155 }; // Paris center
  const R = 1000 * 30; // within a circle of 30 km
  const { latitude, longitude } = randomLocation.randomCirclePoint(P, R);
  const identity = faker.helpers.userCard();
  var arrayName = identity.name.split(' ');
  var firstname = arrayName[0];
  var lastname = arrayName[1];
	const guessedGender = gender.guess(identity.name).gender == 'male' ? 'man' : 'woman';

  return knex('users').insert({
    user_id: id,
    firstname: firstname,
    lastname: lastname,
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJhbGFteSIsImlhdCI6MTUzMzEzMjIzMn0.sVESCLkaJT0ivaT4DKFDbrQC6jUu1tV9rvRrH0ACZ4o',
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
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
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
      const {bio, occupations } = promise;
      for (let id = 1; id < 10; id++) {
        users.push(createUser(knex, id, bio, occupations))
      }

      return Promise.all(users);
    });
};

const gendersData = [
	'man', 'woman', 'man and woman'
]; 

let createGenders = (knex, gender) => {
    return knex('genders').insert({
        name: gender
    })
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('genders').del()
    .then(async function () {
      //Inserts seed entries
      let genders = [];

      gendersData.forEach((gender) => {
        genders.push(createGenders(knex, gender))
      })

      return Promise.all(genders);
    });
};
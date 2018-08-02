const tagsData = [
	'cats', 'dogs', 'movies', 'music', 'books',
	'travel', 'sport', 'pokemon', 'sushi', 'fashion',
	'games', 'yoga', 'writing', 'trekking', 'startup',
	'humor', 'chill', 'kind', 'extrovert', 'introvert',
	'hookup', 'friendship', 'tall', 'short', 'workout'
];

let createTags = (knex, tag) => {
    return knex('tags').insert({
        name: tag
    })
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('tags').del()
    .then(async function () {
      //Inserts seed entries
      let tags = [];

      tagsData.forEach((tag) => {
        tags.push(createTags(knex, tag))
      })

      return Promise.all(tags);
    });
};
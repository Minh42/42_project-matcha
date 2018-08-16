const relationshipsTypeData = [
	'marriage', 'casual sex', 'friends', 'one night stand', 'long term relationship',
	'short term relationship'
];

let createRelationshipType = (knex, relationshipType) => {
    return knex('relationships_type').insert({
        name: relationshipType
    })
}

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('relationships_type').del()
    .then(async function () {
      //Inserts seed entries
      let relationshipsType = [];

      relationshipsTypeData.forEach((relationshipType) => {
        relationshipsType.push(createRelationshipType(knex, relationshipType))
      })

      return Promise.all(relationshipsType);
    });
};
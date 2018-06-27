const pg = require('pg');

const pool = new pg.Pool({
	user: 'postgres',
	host: '192.168.99.100',
	database: 'postgres',
	password: 'mysecretpassword',
	port: '5432'
});

module.exports = pool;
const pg = require('pg');

const pool = new pg.Pool({
	user: 'postgres',
	host: '192.168.99.100',
	database: 'postgres',
	password: 'mysecretpassword',
	port: '5432'
});

pool.query("CREATE TABLE IF NOT EXISTS users(id_user SERIAL PRIMARY KEY, username VARCHAR(30) NOT NULL, first_name VARCHAR(30) NOT NULL, last_name VARCHAR(30) NOT NULL, password VARCHAR(300) NOT NULL, email VARCHAR(50))", (err, res) => {
	if (err)
		console.log(err);
	else 
		console.log('new table');
});

module.exports = pool;
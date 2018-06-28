let conn = require('../config/db')

const pg = require('pg');

const pool = new pg.Pool({
	user: 'postgres',
	host: '192.168.99.100',
	database: 'postgres',
	password: 'mysecretpassword',
	port: '5432'
});

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static addUser(firstname, lastname, login, email, password) {
        
        const requete = 'INSERT INTO users(username, first_name, last_name, password, email) VALUES($1, $2, $3, $4, $5)'
        const values = [login, firstname, lastname, password, email]
        pool.query(requete, values)

    }
}

module.exports = User
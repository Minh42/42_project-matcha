const pool = require('../config/db')
const bcrypt = require('bcrypt');

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static addUser(firstname, lastname, login, email, password) {
        
        const requete = 'INSERT INTO users(username, first_name, last_name, password, email) VALUES($1, $2, $3, $4, $5)'
        const values = [login, firstname, lastname, password, email]
        pool.query(requete, values)
    }

    static async login(username, password) {
        try {
            let res = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
            let hash = res[0]['password'];
            if(Object.keys(res).length > 0 && res[0]['status'] === 1) {
                bcrypt.compare(password, hash, function(err, res) {
                    if(res) {
                        console.log('Passwords match');
                        return true;
                    } else {
                        console.log('Passwords don\'t match');
                        return false;
                    } 
                });
                // if (password === "Born2Code") {
                //     return true;
                // }
                // else
                //     return false;
            }
            else {
                return false;
            }
        } catch(err) {
            throw new Error(err)
        }  
    }


}

module.exports = User
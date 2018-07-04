let conn = require('../config/db')

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static loginExist(login) {       
        const ret = new Promise((resolve, reject) => { 
            conn.query("SELECT username FROM users", function (err, result) {
                if (err) {
                    reject(err);
                }
                Object.keys(result).forEach(function(key) {
                var row = result[key];
                    console.log(row.username);
                    console.log(login);
                    if (row.username === login) {
                        resolve(true);
                    }
                    else {
                        resolve(false);
                    }
                });
            });
        });
        console.log(ret.resolve);
        return(ret);
    }

    static addUser(firstname, lastname, login, email, password) {

        const values = {username: login, first_name: firstname, last_name: lastname, password: password, email: email};
        const requete = 'INSERT INTO users SET ?'
       
        conn.query(requete, values, (err, result) => {
            if (err) throw err;
        });
    }

    static login(username, password) {
        console.log("IM HERE")

        conn.query('SELECT * FROM users WHERE username = ?', ['username'], (error, results) => {
            if (error) throw error;
            // ...
          })

        conn.query('SELECT * FROM users WHERE username')
        return true;
        // if (err) throw err

    }
}

module.exports = User
let conn = require('../config/db')

class User {

    constructor(conn) {
        this.conn = conn;
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
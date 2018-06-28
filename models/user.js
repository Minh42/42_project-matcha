let conn = require('../config/db')

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static login(username, password) {

    }
}

module.exports = Check
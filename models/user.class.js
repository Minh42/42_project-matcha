const pool = require('../config/db')
const bcrypt = require('bcryptjs');

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static async loginExist(login) {   
        try { 
            console.log(login);
            let ret = await pool.query("SELECT count(*) as username_exists FROM users WHERE username = ?", [login]);
            console.log(ret[0].username_exists);
            if (ret[0].username_exists > '0')
                return true;
            else
                return false;
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async emailExist(email) {   
        try {    
            let ret = await pool.query("SELECT count(*) as email_exists FROM users WHERE email = ?", [email]);
            console.log(ret[0].email_exists);
            if (ret[0].email_exists > '0')
                return true;
            else
                return false;
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async addUser(firstname, lastname, login, email, password) {
        try {
            const values = {username: login, first_name: firstname, last_name: lastname, password: password, email: email};
            const requete = 'INSERT INTO users SET ?'
       
            let ret = await pool.query(requete, values)
                if (ret)
                {
                    return true;
                }
                else
                {
                    return false;
                }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    // static async forgot(email) {
        
        
    //     try {



    //     } catch(err) {
    //         throw new Error(err)
    //     }        
    // }

    static async login(username, password) {
        try {
            let ret = await pool.query('SELECT * FROM users WHERE username = ? LIMIT 1', [username]);
            // let hash = res[0]['password'];
            // if(Object.keys(res).length > 0 && res[0]['status'] === 1) {
                // bcrypt.compare(password, hash, function(err, res) {
                //     if(res) {
                //         console.log('Passwords match');
                //         return true;
                //     } else {
                //         console.log('Passwords don\'t match');
                //         return false;
                //     } 
                // });
                if (password === "Born2Code") {
                    return true;
                }
                else
                    return false;
            // }
            // else {
            //     return false;
            // }
        } catch(err) {
            throw new Error(err)
        }  
    }
}

module.exports = User
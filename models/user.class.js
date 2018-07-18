const pool = require('../server/db')
const bcrypt = require('bcryptjs');

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static async loginExist(login) {   
        try { 
            console.log(login);
            let ret = await pool.query("SELECT count(*) as username_exists FROM `users` WHERE `username` = ?", [login]);
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
            let ret = await pool.query("SELECT count(*) as email_exists FROM `users` WHERE `email` = ?", [email]);
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

    static async addUser(firstname, lastname, login, email, password, token) {
        try {
            const values = {username: login, first_name: firstname, last_name: lastname, password: password, email: email, token: token};
            const requete = 'INSERT INTO `users` SET ?'
       
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

    static async compareToken(login, token) {
        try {
            let ret = await pool.query("SELECT `token` FROM `users` WHERE `username` = ?", [login]);
            if (ret[0].token === token)
                return true;
            else
                return false;
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async compareTokenReset(login, token_reset) {
        try {
            let ret = await pool.query("SELECT `token_reset` FROM `users` WHERE `username` = ?", [login]);
            if (ret[0].token_reset === token_reset)
                return true;
            else
                return false;
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async searchByEmail(email) {
        try {
            let ret = await pool.query("SELECT `first_name`, `username` FROM `users` WHERE `email` = ?", [email]);
            return ret;
        } 
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addTokenResetBDD(login, token_reset) {
        try {
            let ret = await pool.query("UPDATE `users` SET `token_reset` = ? WHERE `username` = ?", [token_reset, login]);
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

    static async changeStatus(login) {
        try {
            await pool.query("UPDATE `users` SET `status` = ? WHERE `username` = ?", [1, login]);
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async login(username, password) {
        try {
            let ret = await pool.query('SELECT * FROM `users` WHERE `username` = ? LIMIT 1', [username]);
            let hash = ret[0]['password'];
            if(Object.keys(ret).length > 0 && ret[0]['status'] === 1) {
                const res = await bcrypt.compare(password, hash);
                    if(res) {
                        console.log('Passwords match');
                        return true;
                    } else {
                        console.log('Passwords don\'t match');
                        return false;
                    } 
            }
            else {
                return false;
            }
        } catch(err) {
            throw new Error(err)
        }  
    }

    // static async sendNewPasswordBDD(newPassword, login)
    // {
    //     try {
    //         console.log("HERE");
    //         console.log(login);
    //         let ret = await pool.query("UPDATE `users` SET `password` = ? WHERE `username` = ?", [newPassword, login]);
    //         if (ret)
    //         {
    //             return true;
    //         }
    //         else
    //         {
    //             return false;
    //         }
    //     }
    //     catch(err) {
    //         throw new Error(err)
    //     } 
    // }
}

module.exports = User
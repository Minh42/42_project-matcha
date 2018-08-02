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

    static async googleIdExist(google_id) {   
        try {    
            let ret = await pool.query("SELECT count(*) as googleId_exists FROM `users` WHERE `google_id` = ?", [google_id]);
            if (ret[0].googleId_exists > '0')
                return true;
            else
                return false;
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async searchByGoogleId(google_id) {
        try {
            let ret = await pool.query("SELECT * FROM `users` WHERE `google_id` = ?", [google_id]);
            return ret;
        } 
        catch(err) {
            throw new Error(err)
        } 
    }

    static async searchById(id) {
        try {
            let ret = await pool.query("SELECT * FROM `users` WHERE `user_id` = ?", [id]);
            return ret;
        } 
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addUser(firstname, lastname, login, email, password,  activation_code) {
        try {
            const values = {username: login, firstname: firstname, lastname: lastname, password: password, email: email,  activation_code:  activation_code};
            const requete = 'INSERT INTO `users` SET ?'
       
            let ret = await pool.query(requete, values)
                if (ret) {
                    return true;
                }
                else {
                    return false;
                }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addUserGoogle(username, firstname, lastname, email, google_id) {
        try {
            const values = {username: username, firstname: firstname, lastname: lastname, email : email, google_id : google_id};
            const requete = 'INSERT INTO `users` SET ?'
       
            let ret = await pool.query(requete, values)
                if (ret) {
                    return true;
                }
                else {
                    return false;
                }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async compareToken(login,  activation_code) {
        try {
            let ret = await pool.query("SELECT `activation_code` FROM `users` WHERE `username` = ?", [login]);
            if (ret[0].activation_code ===  activation_code)
                return true;
            else
                return false;
        } 
        catch(err) {
            throw new Error(err)
        }  
    }

    static async compareTokenReset(user_id, token_reset) {
        try {
            let ret = await pool.query("SELECT `token_reset` FROM `users` WHERE `user_id` = ?", [user_id]);
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
            let ret = await pool.query("SELECT `user_id`, `first_name`, `username` FROM `users` WHERE `email` = ?", [email]);
            return ret;
        } 
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addTokenResetBDD(user_id, token_reset) {
        try {
            let ret = await pool.query("UPDATE `users` SET `token_reset` = ? WHERE `user_id` = ?", [token_reset, user_id]);
                if (ret) {
                    return true;
                }
                else {
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
            console.log(password);
            let ret = await pool.query('SELECT * FROM `users` WHERE `username` = ? LIMIT 1', [username]);
            let hash = ret[0]['password'];
            console.log('IM HERE');
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

    static async sendNewPasswordBDD(newPassword, user_id)
    {
        try {
            console.log("HERE");
            console.log(user_id);
            let ret = await pool.query("UPDATE `users` SET `password` = ? WHERE `user_id` = ?", [newPassword, user_id]);
            if (ret) {
                console.log(true)
                return true;
            }
            else {
                return false;
            }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async changeUserInfo(user_id, login, firstname, lastname, email) {
        try {
            let ret = await pool.query("UPDATE `users` SET `username` = ?, `firstname` = ?, `lastname` = ?, `email`= ? WHERE `user_id` = ?", [login, firstname, lastname, email, user_id]);
            if (ret) {
                return true;
            }
            else {
                return false;
            }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }
}


module.exports = User
const pool = require('../server/db')
const bcrypt = require('bcryptjs');

class User {

    constructor(conn) {
        this.conn = conn;
    }

    static async findOne(colName, value) {
        try {
            let ret = await pool.query("SELECT count(*) as value_exists FROM `users` WHERE "+ colName +" = ?", [value]);
            if (ret[0].value_exists > '0')
                return true;
            else
                return false;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async searchByColName(colName, value) {
        try {
            let ret = await pool.query("SELECT * FROM `users` WHERE "+ colName +" = ?", [value]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async selectAll() {
        try {
            let ret = await pool.query("SELECT * FROM `users`")
            return ret;
        } catch(err) {
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

    static async addUserFacebook(firstname, lastname, email, facebookID) {
    try {
        const values = {firstname: firstname, lastname: lastname, email : email, fb_id : facebookID};
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
    
    static async addUserGoogle(username, firstname, lastname, email, googleID) {
        try {
            const values = {username: username, firstname: firstname, lastname: lastname, email : email, google_id : googleID};
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

    static async sendNewPasswordBDD(newPassword, user_id)
    {
        try {
            let ret = await pool.query("UPDATE `users` SET `password` = ? WHERE `user_id` = ?", [newPassword, user_id]);
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

    static async changeBirthdateGender(user_id, birthdate, sex) {
        try {
            let ret = await pool.query("UPDATE `users` SET `birth_date` = ?, `gender` = ? WHERE `user_id` = ?", [birthdate, sex, user_id]);
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

    static async findIdGender(user_id, interest) {
        try {
            let ret = await pool.query("SELECT `gender_id` FROM `interested_in_gender` INNER JOIN `genders` ON genders.gender_id = interested_in_gender.gender_id INNER JOIN `users` ON interested_in_gender.user_id = users.user_id  WHERE `users.user_id` = ? AND `genders.name = ?", [user_id, interest]);
            if (ret) {
                return ret;
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
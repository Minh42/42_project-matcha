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

    static async selectAllUsers() {
        try {
            let requete = "SELECT users.user_id, username, birth_date, image_path FROM `users` JOIN (SELECT user_id, image_path from `user_photos` WHERE `photo_id` in (SELECT max(photo_id) from user_photos GROUP BY user_id)) as most_recent_user_photo ON users.user_id = most_recent_user_photo.user_id";
            let ret = await pool.query(requete);
            return ret;
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async selectAllUserPhotos(userId) {
        try {
            let requete = "SELECT image_path from `users` INNER JOIN `user_photos` ON user_photos.user_id = users.user_id WHERE users.user_id = ?";
            let ret = await pool.query(requete, [userId]);
            return ret;
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async selectAllUserTags(userId) {
        try {
            let requete = "SELECT name FROM `user_tags` INNER JOIN `tags` ON tags.tag_id = user_tags.tag_id WHERE user_tags.user_id = ?";
            let ret = await pool.query(requete, [userId]);
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

    //RANDOM USERNAME
    static makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }

    // ONBOARDING
    static async onboardingState(user_id) {
        try {
            let ret = await pool.query("SELECT `onboardingDone` FROM `users` WHERE `user_id` = ?", [user_id]);
            console.log('onboardingState')
            console.log(ret[0].onboardingDone)
            return ret[0].onboardingDone
        }
        catch(err) {
            throw new Error(err)
        } 
    }



    // TABLE TAGS
    static async findOneTag(colName, value) {
        try {
            let ret = await pool.query("SELECT count(*) as value_exists FROM `tags` WHERE "+ colName +" = ?", [value]);
            if (ret[0].value_exists > '0')
                return true;
            else
                return false;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async findOneUserTags(tag_id, user_id) {
        try {
            let ret = await pool.query("SELECT count(*) as value_exists FROM `user_tags` WHERE `tag_id` = ? AND `user_id` = ?", [tag_id , user_id]);
            if (ret[0].value_exists > '0')
                return true;
            else
                return false;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async searchByColNameTag(colName, value) {
        try {
            let ret = await pool.query("SELECT * FROM `tags` WHERE "+ colName +" = ?", [value]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addTagBDD(tag) {
        try {
            const values = {name: tag};
            const requete = 'INSERT INTO `tags` SET ?'
       
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

    static async addInsideUserTag(tag_id, user_id) {
        try {
            console.log(tag_id)
            console.log(user_id)
            const values = {user_id: user_id, tag_id: tag_id};
            const requete = 'INSERT INTO `user_tags` SET ?'
       
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

    static async findIdTagUser(user_id) {
        try {
            let ret = await pool.query("SELECT `tag_id` FROM `user_tags` WHERE `user_id` = ?", [user_id]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    //FIND TAGS FROM TAGS
    static async findTagName(tag_id) {
        try {
            let ret = await pool.query("SELECT `name` FROM `tags` WHERE `tag_id` = ?", [tag_id]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    //DELETE TAG FROM USER_TAGS
    static async deleteTagInsideUserTags(user_id, tag_id) {
        try {
            let ret = await pool.query("DELETE FROM `user_tags` WHERE `user_id` = ? AND `tag_id` = ?", [user_id, tag_id])
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

    //LOCALISATION
    static async addLatLng(lat, lng, user_id) {
        try {
            let ret = await pool.query("UPDATE `users` SET `latitude` = ?, `longitude` = ? WHERE `user_id` = ?", [lat, lng, user_id]);
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

    //INSERT NEW INFO FROM ONBOARDING

    static async addNewinfoUser(birthdate, gender, occupation, bio, user_id) {
        try {
            let ret = await pool.query("UPDATE `users` SET `birth_date` = ?, `gender` = ?, `bio` = ?, `occupation`= ? WHERE `user_id` = ?", [birthdate, gender, bio, occupation, user_id]);
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
}


module.exports = User
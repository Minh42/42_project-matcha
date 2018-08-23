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

    static async selectAllUserInfos(userId) {
        try {
            let requete = "SELECT * from `users` WHERE users.user_id = ?";
            let ret = await pool.query(requete, [userId]);
            return ret;
        } catch(err) {
            console.log(err);
            return false;
        }         
    }

    static async selectAllUserPhotos(userId) {
        try {
            let requete = "SELECT image_path from `users` INNER JOIN `user_photos` ON user_photos.user_id = users.user_id WHERE users.user_id = ?";
            let ret = await pool.query(requete, [userId]);
            return ret;
        } catch(err) {
            console.log(err);
            return false;
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

    //-----------------------------RANDOM USERNAME--------------------------------
    static makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 5; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
      }

    //---------------------------------ONBOARDING---------------------------------
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

    static async changeStatusOnboarding(user_id) {
        try {
            await pool.query("UPDATE `users` SET `onboardingDone` = ? WHERE `user_id` = ?", [1, user_id]);
        } 
        catch(err) {
            throw new Error(err)
        }  
    }



    // --------------------------------TABLE TAGS--------------------------------
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
            // console.log(user_id)
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

    //---------------------------FIND TAGS FROM TAGS------------------------------
    static async findTagName(tag_id) {
        try {
            let ret = await pool.query("SELECT `name` FROM `tags` WHERE `tag_id` = ?", [tag_id]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    //--------------------------DELETE TAG FROM USER_TAGS-------------------------
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

    //------------------------------LOCALISATION---------------------------------
    static async addLatLng(lat, lng, user_id) {
        try {
            console.log(lat)
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

    static async findLatLngBDD(user_id) {
        try {
            let ret = await pool.query("SELECT `latitude`, `longitude`, `geolocalisationAllowed` FROM `users` WHERE `user_id` = ?", [user_id]);
            console.log("inside fonction ret:", ret)
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    //-----------------------INSERT NEW INFO FROM ONBOARDING-------------------------

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

    //-------------------CHANGE INFO GEOLOCALISATION ALLOW-----------------------

    static async changeGeolocalisationAllow(user_id, geolocalisationAllow) {
        try {
            let ret = await pool.query("UPDATE `users` SET `geolocalisationAllowed` = ? WHERE `user_id` = ?", [geolocalisationAllow, user_id]);
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

    //--------------------add IP BDD-----------------------

    static async addIP(user_id, ip) {
        try {
            let ret = await pool.query("UPDATE `users` SET `ip_address` = ? WHERE `user_id` = ?", [ip, user_id]);
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

    //------------------------ADD INTEREST INSIDE BDD---------------------------

    static async searchIdGenders(interest) {
        try {
            console.log(interest)
            let ret = await pool.query("SELECT `gender_id` FROM `genders` WHERE `name` = ?", [interest]);
            console.log(ret)
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addInsideInterestedInGender(gender_id, user_id) {
        try {
            console.log(gender_id)
            const values = {user_id: user_id, gender_id: gender_id};
            const requete = 'INSERT INTO `interested_in_gender` SET ?'
       
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

    static async findUserId(table, user_id) {
        try {
            console.log("table", table)
            let ret = await pool.query("SELECT count(*) as id_exists FROM "+ table +" WHERE `user_id` = ?", [user_id]);
            console.log(ret)
            if (ret[0].id_exists > '0')
                return true;
            else
                return false;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    //---------------------ADD RELATIONSHIP INSIDE BDD--------------------

    static async searchRelationshipId(relationship) {
        try {
            console.log(relationship)
            let ret = await pool.query("SELECT `relationship_type_id` FROM `relationships_type` WHERE `name` = ?", [relationship]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addInsideinterestedInRelation(relationship_type_id, user_id) {
        try {
            const values = {user_id: user_id, relationship_type_id: relationship_type_id};
            const requete = 'INSERT INTO `interested_in_relation` SET ?'
       
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

    static async updateInterestedInGender(user_id, gender_id) {
        try {
            let ret = await pool.query("UPDATE `interested_in_gender` SET `gender_id` = ? WHERE `user_id` = ?", [gender_id, user_id]);
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

    static async updateInterestedInRelation(user_id, relationship_type_id) {
        try {
            let ret = await pool.query("UPDATE `interested_in_relation` SET `relationship_type_id` = ? WHERE `user_id` = ?", [relationship_type_id, user_id]);
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

    //--------------FIND NAME GENDERS AND RELATIONSHIP USER------------------
    static async selectNameGenders(user_id) {
        try {
            let ret = await pool.query("SELECT `name` FROM `genders` INNER JOIN `interested_in_gender` ON interested_in_gender.gender_id = genders.gender_id INNER JOIN `users` ON users.user_id = interested_in_gender.user_id WHERE users.user_id = ?", [user_id]);
            console.log("name:", ret)
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async selectNameRelationship(user_id) {
        try {
            let ret = await pool.query("SELECT `name` FROM `relationships_type` INNER JOIN `interested_in_relation` ON interested_in_relation.relationship_type_id = relationships_type.relationship_type_id INNER JOIN `users` ON users.user_id = interested_in_relation.user_id WHERE users.user_id = ?", [user_id]);
            console.log("name:", ret)
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    // -------------------------LIKE---------------------------

    static async findLikeUser(id_actual_user, user_like) {
        try {
            let ret = await pool.query("SELECT count(*) as id_exists FROM `likes` WHERE `from_user_id` = ? AND `to_user_id` = ?" , [id_actual_user, user_like]);
            console.log(ret)
            if (ret[0].id_exists > '0')
                return true;
            else
                return false;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addLikeBDD(id_actual_user, user_like) {
        try {
            let ret = await pool.query("INSERT INTO `likes` SET `from_user_id` = ?, `to_user_id` = ? ", [id_actual_user, user_like]);
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

    static async deleteLikeBDD(id_actual_user, user_like) {
        try {
            let ret = await pool.query("DELETE FROM `likes` WHERE `from_user_id` = ? AND `to_user_id` = ? ", [id_actual_user, user_like]);
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

    static async searchUserWhoLike(user_id) {
        try {
            let ret = await pool.query("SELECT `to_user_id` FROM `likes` WHERE `from_user_id` = ? ",[user_id]);
            console.log(ret)
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    

}



module.exports = User

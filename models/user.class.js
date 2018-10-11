const pool = require('../server/db')
const bcrypt = require('bcryptjs');

class User {

    constructor(conn) {
        this.conn = conn;
    }
    static async findUserByID(user_id) {
        try {
                let ret = await pool.query("SELECT * FROM `users` WHERE `user_id` = ?", [user_id]);
                return ret;
            }
            catch(err) {
                throw new Error(err)
            } 
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

    static async selectAllUsers(userId) {
        try {
            let requete = "SELECT users.user_id, users.firstname, users.lastname, users.username, users.imageProfile_path, GROUP_CONCAT(DISTINCT tags.name) AS tags, users.birth_date, users.gender, users.latitude, users.longitude, users.occupation, users.popularity, GROUP_CONCAT(DISTINCT likes.from_user_id) AS likes, GROUP_CONCAT(DISTINCT views.from_user_id) AS views, GROUP_CONCAT(DISTINCT genders.name) AS genders, GROUP_CONCAT(DISTINCT relationships_type.name) AS relationships_type FROM `users` INNER JOIN `user_tags` ON user_tags.user_id = users.user_id LEFT JOIN `tags` ON tags.tag_id = user_tags.tag_id LEFT JOIN `likes` ON likes.to_user_id = users.user_id LEFT JOIN `views` ON views.to_user_id = users.user_id INNER JOIN `interested_in_gender` ON interested_in_gender.user_id = users.user_id LEFT JOIN `genders` ON genders.gender_id = interested_in_gender.gender_id INNER JOIN `interested_in_relation` ON interested_in_relation.user_id = users.user_id LEFT JOIN `relationships_type` ON relationships_type.relationship_type_id = interested_in_relation.relationship_type_id WHERE users.user_id != ? GROUP BY users.user_id";
            let ret = await pool.query(requete, [userId]);
            return ret;
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async selectAllUsersInformations(userId) {
        try {
            let requete = "SELECT users.user_id, users.firstname, users.lastname, users.username, users.imageProfile_path, GROUP_CONCAT(DISTINCT tags.name) AS tags, users.birth_date, users.gender, users.latitude, users.longitude, users.occupation, users.popularity, GROUP_CONCAT(DISTINCT usersWholikedMe.from_user_id) AS usersWholikedMe, GROUP_CONCAT(DISTINCT usersLikedByMe.to_user_id) AS usersLikedByMe, GROUP_CONCAT(DISTINCT views.from_user_id) AS views, GROUP_CONCAT(DISTINCT genders.name) AS genders, GROUP_CONCAT(DISTINCT relationships_type.name) AS relationships_type, GROUP_CONCAT(DISTINCT usersBlockedByMe.user_id_blocked) AS usersBlockedByMe FROM `users` INNER JOIN `user_tags` ON user_tags.user_id = users.user_id LEFT JOIN `tags` ON tags.tag_id = user_tags.tag_id LEFT JOIN `likes` AS `usersWholikedMe` ON usersWholikedMe.to_user_id = users.user_id LEFT JOIN `likes` AS `usersLikedByMe` ON usersLikedByMe.from_user_id = users.user_id LEFT JOIN `views` ON views.to_user_id = users.user_id INNER JOIN `interested_in_gender` ON interested_in_gender.user_id = users.user_id LEFT JOIN `genders` ON genders.gender_id = interested_in_gender.gender_id INNER JOIN `interested_in_relation` ON interested_in_relation.user_id = users.user_id LEFT JOIN `relationships_type` ON relationships_type.relationship_type_id = interested_in_relation.relationship_type_id LEFT JOIN `block_user` AS `usersBlockedByMe` ON usersBlockedByMe.user_id = users.user_id WHERE users.user_id = ? GROUP BY users.user_id";
            let ret = await pool.query(requete, [userId]);
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
            let requete = "SELECT image_path, date_created from `user_photos` WHERE user_id = ?";
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
            const values = {username: login, firstname: firstname, lastname: lastname, password: password, email: email, activation_code: activation_code, popularity: Math.random() * (100 - 1) + 1};
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
        const values = {firstname: firstname, lastname: lastname, email : email, fb_id : facebookID, popularity: Math.floor(Math.random() * 100)};
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
            const values = {username: username, firstname: firstname, lastname: lastname, email : email, google_id : googleID, popularity: Math.floor(Math.random() * 100)};
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

    static async updateLastLogin(user_id) {
        try {
            let ret = await pool.query("UPDATE `users` SET `last_login` = ? WHERE `user_id` = ?", [new Date(), user_id]);
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
            console.log('im here')
            console.log(ret[0].token_reset)
            console.log(token_reset)
            console.log('im here')
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
            if (ret[0] != undefined) {
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
            } else {
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
            let ret1 = await pool.query("SELECT username FROM `users` WHERE `user_id` = ?", [user_id]);
            let ret2 = await pool.query("SELECT count(*) as value_exists FROM `users` WHERE `username` = ?", [login]);
            if (ret1[0].username === login) {
                await pool.query("UPDATE `users` SET `username` = ?, `firstname` = ?, `lastname` = ?, `email`= ? WHERE `user_id` = ?", [login, firstname, lastname, email, user_id]);
                return true;
            } else {
                if (ret2[0].value_exists > '0') {         
                    return false;
                } else {
                    await pool.query("UPDATE `users` SET `username` = ?, `firstname` = ?, `lastname` = ?, `email`= ? WHERE `user_id` = ?", [login, firstname, lastname, email, user_id]);
                    return true;
                }
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

    //---------------------------FIND TAGS FROM TAGS------------------------------
    static async findTags(user_id) {
        try {
            let ret = await pool.query("SELECT `name` FROM `tags` INNER JOIN `user_tags` ON user_tags.tag_id = tags.tag_id WHERE `user_id` = ?", [user_id]);
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
            let ret = await pool.query("SELECT `gender_id` FROM `genders` WHERE `name` = ?", [interest]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addInsideInterestedInGender(gender_id, user_id) {
        try {
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
            let ret = await pool.query("SELECT count(*) as id_exists FROM "+ table +" WHERE `user_id` = ?", [user_id]);
            if (ret[0].id_exists > '0') {
                return true;
            }
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
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async selectNameRelationship(user_id) {
        try {
            let ret = await pool.query("SELECT `name` FROM `relationships_type` INNER JOIN `interested_in_relation` ON interested_in_relation.relationship_type_id = relationships_type.relationship_type_id INNER JOIN `users` ON users.user_id = interested_in_relation.user_id WHERE users.user_id = ?", [user_id]);
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
            let ret = await pool.query('SELECT COUNT(*) as value_exists FROM `likes` WHERE `from_user_id` = ? AND `to_user_id` = ?', [user_like, id_actual_user]);
            console.log(ret)
            if (ret[0].value_exists > '0') {
                let ret1 = await pool.query("INSERT INTO `likes` SET `from_user_id` = ?, `to_user_id` = ? ", [id_actual_user, user_like]);
                if (ret1) {
                    var notificationData = {
                    action_type: "match",
                    entity_type_id: 3,
                    entity_id: ret1.insertId,
                    actor_id: id_actual_user,
                    notifier_id: user_like
                    }
                    return notificationData;
                }
            } else {
                let ret2 = await pool.query("INSERT INTO `likes` SET `from_user_id` = ?, `to_user_id` = ? ", [id_actual_user, user_like]);
                if (ret2) {
                    var notificationData = {
                    action_type: "add like",
                    entity_type_id: 1,
                    entity_id: ret2.insertId,
                    actor_id: id_actual_user,
                    notifier_id: user_like
                    }
                    return notificationData;
                }
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
                    var notificationData = {
                        action_type: "delete like",
                        entity_type_id: 2,
                        entity_id: ret.insertId,
                        actor_id: id_actual_user,
                        notifier_id: user_like
                    }
                    return notificationData;
                }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async searchUserWhoLike(user_id) {
        try {
            let ret = await pool.query("SELECT `to_user_id` FROM `likes` WHERE `from_user_id` = ? ",[user_id]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addProfilePicture(user_id, path) {
        try {
            let ret = await pool.query("UPDATE `users` SET imageProfile_path = ? WHERE `user_id` = ? ", [path, user_id]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addUserViews(current_user, user_id) {
        try {
            let ret = await pool.query("INSERT INTO `views` SET `from_user_id` = ?, `to_user_id` = ? ", [current_user, user_id]);
            console.log('views info:', ret)
            if (ret) {
                var notificationData = {
                action_type: "add view",
                entity_type_id: 4,
                entity_id: ret.insertId,
                actor_id: current_user,
                notifier_id: user_id
                }
                console.log(notificationData)
                return notificationData;
            }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async searchBlockedUser(current_user) {
        try {
            let ret = await pool.query("SELECT user_id_blocked FROM `block_user` WHERE `user_id` = ?", [current_user]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

   // ----------------------------CONVERSATION-----------------------------------

   static async addNewConversation(participant1, participant2) {
        try {
            let count = await pool.query("SELECT count(conversation.conversation_id) AS `value_exists` FROM `conversation` INNER JOIN `participant` AS p1 ON p1.conversation_id = conversation.conversation_id INNER JOIN `participant` as p2 ON p2.conversation_id = conversation.conversation_id WHERE p1.participant_id = ? AND p2.participant_id = ?", [participant1, participant2]);
            if (count[0].value_exists > '0') {
                console.log('i came here')
                return false;
            } else {
                let ret = await pool.query("INSERT INTO `conversation` SET `user_id` = ?", [participant1]);
                var conversation_id = ret.insertId;
                await pool.query("INSERT INTO `participant` SET `conversation_id` = ?, `participant_id` = ?", [conversation_id, participant1]);
                await pool.query("INSERT INTO `participant` SET `conversation_id` = ?, `participant_id` = ?", [conversation_id, participant2]);
                return true;
            }
        }
        catch(err) {
            throw new Error(err)
        } 
    }

   static async deleteNewConversation(conversation_id) {
    try {
        let ret = await pool.query("DELETE FROM `conversation` WHERE `conversation_id` = ?", [conversation_id]);
        return ret;
    }
    catch(err) {
        throw new Error(err)
    } 
}

    static async searchReportedUser(user_id) {
        try {
            let ret = await pool.query("SELECT count(*) as value_exists FROM `report_user` WHERE `user_id_reported` = ?", [user_id]);
            if (ret[0].value_exists > '0')
                return true;
            else
                return false;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async addParticipant(participant_id, conversation_id) {
        console.log(conversation_id)
        try {
            let ret = await pool.query("INSERT INTO `participant` SET `conversation_id` = ?, `participant_id` = ?", [id_conversation, user_id]);
            return true;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async reportUser(current_user, user_id) {
        try {
            let ret = await pool.query("INSERT INTO `report_user` SET `user_id` = ?, `user_id_reported` = ? ", [current_user, user_id]);
            return true;
        }
        catch(err) {
            console.log(err);
            return false;
        } 
    }

    static async blockUser(current_user, user_id) {
        try {
            let ret = await pool.query("SELECT count(*) as value_exists FROM `block_user` WHERE `user_id` = ? AND `user_id_blocked` = ?", [current_user, user_id]);
            if (ret[0].value_exists > '0') {
                let ret = await pool.query("DELETE FROM `block_user` WHERE `user_id` = ? AND `user_id_blocked` = ?", [current_user, user_id]);
                return "unblocked";
            } else {
                let ret = await pool.query("INSERT INTO `block_user` SET `user_id` = ?, `user_id_blocked` = ? ", [current_user, user_id]);
                return "blocked";
            }
        }
        catch(err) {
            console.log(err);
            return false;
        }
    }

    static async findAllConversation(current_user) {
        try {
            let ret = await pool.query("SELECT `conversation_id` FROM `participant` WHERE `participant_id` = ? ", [current_user]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async findIdParticipantConversation(conversation, current_user) {
        try {
            let ret = await pool.query("SELECT `participant_id` FROM `participant` WHERE `conversation_id` = ? AND `participant_id` != ?",[conversation, current_user]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    static async findAllConversationtionID(id) {
        try {
            let ret = await pool.query("SELECT `conversation_id` FROM `participant` WHERE `participant_id` = ?",[id]);
            return ret;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

   // ---------------------------------ADD MESSAGES BDD--------------------------------

   static async addMessageBDD(current_user, message) {
        try {
            let ret = await pool.query("INSERT INTO `message` SET `participant_id` = ?, `message` = ?", [current_user, message]);
            return true;
        }
        catch(err) {
            throw new Error(err)
        } 
    }

    // Notifications

    static async insertNotification(entity_type_id, entity_id, actor_id, notifier_id) {
        try {
            let ret = await pool.query("INSERT INTO `notification_object` SET `entity_type_id` = ?, `entity_id` = ? ", [entity_type_id, entity_id]);
            let notification_object_id = ret.insertId;
            await pool.query("INSERT INTO `notification_change` SET `notification_object_id` = ?, `actor_id` = ? ", [notification_object_id, actor_id]);
            await pool.query("INSERT INTO `notification` SET `notification_object_id` = ?, `notifier_id` = ? ", [notification_object_id, notifier_id]);
            if (ret) {
                console.log(notification_object_id)
                return notification_object_id;
            }
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async getNotification(notification_object_id) {
        try {
            let requete1 = "SELECT `notifier_id` FROM `notification` WHERE notification_object_id = ?";
            let ret1 = await pool.query(requete1, [notification_object_id]);
            var notifier_id = ret1[0].notifier_id;

            var requete2 = "SELECT `firstname`, `lastname` FROM `users` INNER JOIN `notification_change` ON notification_change.actor_id = users.user_id INNER JOIN `notification_object` ON notification_object.id = notification_change.notification_object_id WHERE notification_object.id = ?";
            let ret2 = await pool.query(requete2, [notification_object_id]);
            var firstname = ret2[0].firstname;
            var lastname = ret2[0].lastname;

            var requete3 = "SELECT `entity_type_id` FROM `notification_object` WHERE notification_object.id = ?";
            let ret3 = await pool.query(requete3, [notification_object_id]);
            var entity_type_id = ret3[0].entity_type_id;

            const customData = {
                notifier_id: notifier_id,
                firstname: firstname,
                lastname: lastname,
                entity_type_id: entity_type_id
            };
            return customData;
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async searchNotifications(user_id) {
        try {
            var infoNotif = new Array();


            var ret = await pool.query("SELECT notification_object.id, notification_object.entity_type_id, notification_change.actor_id FROM `notification_object` INNER JOIN `notification` ON notification.notification_object_id = notification_object.id INNER JOIN `notification_change` ON notification_change.notification_object_id = notification_object.id WHERE notification.notifier_id = ? AND notification_object.status = ?", [user_id, 0]);
            console.log('searchNotifi', ret)
            for (var i = 0; ret.length > i; i++) {
                // console.log(ret[i].id)
                if (ret[i].entity_type_id === 1) {
                   var message = " liked your profile."
                } else if (ret[i].entity_type_id === 2){
                    var message = " unliked your profile."
                } else if (ret[i].entity_type_id === 3){
                    var message = " matches with you."
                } else if (ret[i].entity_type_id === 4){
                    var message = " viewed your profile."
                } else if (ret[i].entity_type_id === 5){
                    var message = " send you a message."
                }
                var ret1 = await pool.query("SELECT `user_id`, `firstname`, `lastname`, `imageProfile_path` FROM `users` WHERE user_id = ?", [ret[i].actor_id]);
                console.log('before', ret1)
                ret1.push(message, ret[i].id)
                console.log('after', ret1)
                infoNotif.push(ret1)
                console.log(infoNotif)
            }
            return infoNotif;
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async getConversationsList(conversation_id) {
        try {
            const ret = pool.query('SELECT user_id, firstname, lastname, imageProfile_path FROM `participant` INNER JOIN `users` ON users.user_id = participant.participant_id WHERE participant.conversation_id = ?', [conversation_id]);
            return ret;
            } catch(err) {
                throw new Error(err)
        } 
    }

    static async changeStatusNotification(notification_id) {
        try {
            var ret = await pool.query("UPDATE `notification_object` SET `status` = ? WHERE `id` = ?", [1, notification_id]);
            if (ret) {
                return true;
            }
        } catch(err) {
            throw new Error(err)
        } 
    }

    static async getLastParticipantID(conversation_id) {
        try {
            const ret = await pool.query('SELECT user_id, firstname, lastname, imageProfile_path FROM `participant` INNER JOIN `users` ON users.user_id = participant.participant_id WHERE participant.conversation_id = ?', [conversation_id]);
            return ret;
        } catch(err) {
            throw new Error(err)
        } 
    }


}

module.exports = User

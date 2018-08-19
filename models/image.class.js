const pool = require('../server/db')
const isJpg = require('is-jpg');
const isPng = require('is-png');
const isGif = require('is-gif');
const isBmp = require('is-bmp');

class Image {

    constructor(conn) {
        this.conn = conn;
    }

    static isValid(buffer, mimetype, size) {
        const allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/bmp'];
        if ((isJpg(buffer) || isPng(buffer) || isGif(buffer) || isBmp(buffer)) 
            && allowedMimeTypes.includes(mimetype) && size < 2000000) {  
            return true;
        } else {
            return false;
        }
    }

    static async saveAsProfilePicture(path) {
        try {
            const values = {imageProfile_path: login};
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

    static async savePicture(user_id, path) {
        try {
            let count = await pool.query("SELECT count(*) as value_exists FROM `user_photos` WHERE `user_id` = ?", [user_id]);
            if (count[0].value_exists <= '5') {
                const values = {user_id: user_id, image_path: path};
                const requete = 'INSERT INTO `user_photos` SET ?'
                await pool.query(requete, values)
                return true;
            } else {
                return false;
            }   
        }
        catch(err) {
            console.log(err)
            return false;
        }
    }

    static async deletePicture(userId, path) {
        try {
            let requete = "DELETE FROM `user_photos` WHERE user_id = ? AND image_path = ?";
            let ret = await pool.query(requete, [userId, path]);
            return true;
        } catch(err) {
            console.log(err);
            return false;
        } 
    }
    
}

module.exports = Image
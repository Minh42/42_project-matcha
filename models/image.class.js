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
            const values = {user_id: user_id, image_path: path};
            const requete = 'INSERT INTO `user_photos` SET ?'
            let ret = await pool.query(requete, values)
            return true;
        }
        catch(err) {
            console.log(err)
            return false;
        }
    }

    static async deletePicture(userId, path) {
        try {
            let requete = "SELECT image_path from `users` INNER JOIN `user_photos` ON user_photos.user_id = users.user_id WHERE users.user_id = ?";
            let ret = await pool.query(requete, userId);
            if (ret.includes(path)) {
                return true;
            } else {
                console.log('No such record in database');
                return false;
            }
        } catch(err) {
            throw new Error(err)
        } 
    }
    
}

module.exports = Image
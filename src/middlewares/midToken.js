const jwt = require('jsonwebtoken');
const config = require('../../server/config/keys');

module.exports = function verifyToken(req, res, next) {
    console.log('i came here')
    if (req.user) {
        req.currentUser = req.user[0];
        next();
    } else {
        console.log('it wasnt me')
        const authorizationHeader = req.headers.authorization;
        let token;
        console.log(authorizationHeader)
        if (authorizationHeader) {
            token = authorizationHeader.split(' ')[1];
        }
        if (token) {
            jwt.verify(token, config.jwtSecret, (err, decoded) => {
                if (err) {
                    res.status(401).json({ error: 'Failed to authenticate' })
                } else {
                    // console.log(decoded);
                    req.currentUser = decoded.user;
                    next();
                }
            });
        } else {
            res.status(403).json({
                error: 'No token provided'
            });
        }
    }
}
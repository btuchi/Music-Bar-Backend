const jwt = require("jsonwebtoken");
const config = require('../config')
const secretKey =  config.secretKey
const expiresIn = config.expiresIn

class TokenManager {
    static generateAccessToken(uid, scope) {
        const token = jwt.sign({
                uid,
                scope
            },
            secretKey, {
                expiresIn,
            }
        );
        return token;
    }

    static async verifyAccessToken(token) {
        try {
            var decode = jwt.verify(token, secretKey);
            return {
                res: true,
                uid: decode.uid,
                scope: decode.scope,
            };
        } catch (error) {
            console.log(error.message);
            return {
                res: false,
                msg: error.message,
            };
        }
    }
}

module.exports = { TokenManager };
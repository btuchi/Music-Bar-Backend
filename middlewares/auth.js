const { HTTPException } = require("../core/http-exception")
const {User} = require("../app/models/user")
const { TokenManager } = require("../util/token_util")
const userAuthTable = require("../config").userAuthTable

class Auth{
    constructor(level){
        this.level = level
    }

    get m(){
        return async (ctx, next) => {
            const token = ctx.request.headers.token
            let res = await TokenManager.verifyAccessToken(token)
            if (!res.res){
                throw new HTTPException(res.msg,10004)
            }
            let user_id = res.uid
            let user_type = res.scope
        //     let session = await Session.findOne({
        //         where:{
        //         session_content:token
        //     }
        // })

        // if(!session){
        //     throw new HTTPException("invalid token", 10004)
        // }
        // if(session.session_expire_time < new Date().getTime()){
        //     throw new HTTPException("token expired", 10005)
        // }

        // let user_id = session.user_id
        // let user = await User.findOne({
        //     where:{
        //         user_id:user_id
        //     }
        // })
        // let user_type = user.user_type
        let user_auth = userAuthTable[user_type]

        if(user_auth < this.level){
            throw new HTTPException("Unauthorized", 10007)
        }
        ctx.auth = {
            user_auth,
            user_id
        }
        await next()

            }
        }
}

module.exports = { Auth }
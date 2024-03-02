const {HTTPException} = require("../core/http-exception")

async function exceptionHandler(ctx, next) {
    try{
        await next()
    }catch(err){
        if(err instanceof HTTPException){
            ctx.body = {
                errorCode: err.errorCode,
                msg: err.msg,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = err.code
        } else {
            // ctx.body = {
            //     errorCode: -1,
            //     msg: "we made a mistake",
            //     request: `${ctx.method} ${ctx.path}`
            // }
            // ctx.status = 500
            throw err
        }
    }
}

module.exports = { exceptionHandler }
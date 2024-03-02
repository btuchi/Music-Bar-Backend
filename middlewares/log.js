async function log(ctx, next){
    let timeStr = new Date().getTime()
    console.group(timeStr + ": Interface " + ctx.request.url + " has been called")
    console.log("ctx.request.ip: ", ctx.request.ip)
    console.log("ctx.request.method: ", ctx.request.method)
    console.log("ctx.request.header: ", JSON.stringify(ctx.request.header))
    console.log("ctx.request.body: ", ctx.request.body)
    console.log("ctx.request.query: ", ctx.request.query)
    console.groupEnd()
    await next();
}

module.exports = {log}
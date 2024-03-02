async function timer(ctx, next){
    let start = new Date().getTime()
    await next()
    let end = new Date().getTime()
    console.log("Spend Time:", end-start)
}

module.exports = { timer }
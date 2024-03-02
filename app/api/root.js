const Router = require("koa-router")
const router = new Router({
    prefix: "",
})

router.get("/info", async(ctx) => {
    console.log("info")
})

router.get("/info2", async(ctx) => {
    console.log("info2")
})

module.exports = router
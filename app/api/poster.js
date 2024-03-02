const Router = require("koa-router")
const {Auth} = require("../../middlewares/auth")
const { Poster } = require("../../app/models/poster")
const { HTTPException } = require("../../core/http-exception")

const router = new Router({
    prefix: "/poster",
})

router.get("/list", async(ctx) => {
    let posters = await Poster.findAll({
        where:{
            poster_is_online: true
        },
        attributes: ["poster_image"],
        order: [
            ["poster_priority", "DESC"]
        ]
    })

    ctx.body = {
        code: 0,
        msg: "success",
        data: posters
    }
})

module.exports = router
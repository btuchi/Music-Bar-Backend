const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { Poster } = require("../../../app/models/poster")
const { HTTPException } = require("../../../core/http-exception")

const router = new Router({
    prefix: "/admin/poster",
})

router.post("/add", new Auth(64).m, async(ctx) => {
    let poster_image = ctx.request.body.poster_image
    let poster_priority = ctx.request.body.poster_priority
    await Poster.create({
        poster_image,
        poster_priority,
        poster_is_online: true
    })
    ctx.body = {
        code: 0,
        msg: "Poster added successfully"
    }
})

router.put("/update", new Auth(64).m, async(ctx) => {
    let poster_id = ctx.request.body.poster_id
    let poster_image = ctx.request.body.poster_image
    let poster_priority = ctx.request.body.poster_priority
    let poster = await Poster.findOne({
        where:{
            poster_id: poster_id
        }
    })
    if(!poster){
        throw new HTTPException("Poster does not exist", 10002)
    }
    await poster.update({
        poster_image,
        poster_priority,
    })
    ctx.body = {
        code: 0,
        msg: "Poster updated successfully"
    }
})

router.delete("/delete", new Auth(64).m, async(ctx) => {
    let poster_id = ctx.request.body.poster_id
    let poster = await Poster.findOne({
        where:{
            poster_id: poster_id
        }
    })
    if(!poster){
        throw new HTTPException("Poster does not exist", 10002)
    }
    await poster.destroy()
    ctx.body = {
        code: 0,
        msg: "Poster deleted successfully"
    }
})
router.get("/list", new Auth(64).m, async(ctx) => {
    // 从哪里开始
    let offset = ctx.request.query.offset
    // 显示几个
    let limit = ctx.request.query.limit

    if(!offset){
        offset = 0
    }
    if(!limit){
        limit = 10
    }

    let posters = await Poster.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['poster_priority', 'DESC']
        ]
    })
    let all_count = await Poster.count()

    ctx.body = {
        code: 0,
        msg: "success",
        data: {
            all_count: all_count,
            count: posters.length,
            objects: posters
        }
    }
})


router.put("/online", new Auth(64).m, async(ctx) => {
    let poster_id = ctx.request.body.poster_id
    let poster = await Poster.findOne({
        where:{
            poster_id: poster_id
        }
    })
    if (!poster){
        throw new HTTPException("Poster does not exist", 10002)
    }
    if (poster.poster_is_online){
        throw new HTTPException("Poster is already online", 10002)
    }
    await poster.update({
        poster_is_online: true
    })
    ctx.body = {
        code: 0,
        msg: "Poster is online now"
    }
})

router.put("/offline", new Auth(64).m, async(ctx) => {
    let poster_id = ctx.request.body.poster_id
    let poster = await Poster.findOne({
        where:{
            poster_id: poster_id
        }
    })
    if (!poster){
        throw new HTTPException("Poster does not exist", 10002)
    }
    if (!poster.poster_is_online){
        throw new HTTPException("Poster is already offline", 10002)
    }
    await poster.update({
        poster_is_online: false
    })
    ctx.body = {
        code: 0,
        msg: "Poster is offline now"
    }
})

module.exports = router
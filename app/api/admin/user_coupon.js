const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { User } = require("../../../app/models/user")
const { UserCoupon } = require("../../../app/models/user_coupon")
const { HTTPException } = require("../../../core/http-exception")
const router = new Router({
    prefix: "/admin/user_coupon",
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

    let objects, all_count
    objects = await UserCoupon.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        include: [{
            model: User,
            as: "user",
            attributes: ['user_name']
        }],
        order: [
            ['createdAt', 'DESC']
        ]
    })
    all_count = await UserCoupon.count({})
    

    ctx.body = {
        code: 0,
        msg: "success",
        data: {
            all_count: all_count,
            count: objects.length,
            data: objects
        }
    }
})

module.exports = router
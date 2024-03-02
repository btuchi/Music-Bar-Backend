const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { Commodity } = require("../../../app/models/commodity")
const { HTTPException } = require("../../../core/http-exception")
const { User } = require("../../../app/models/user")
const router = new Router({
    prefix: "/admin/commodity",
})

const checkAuth = async (ctx, branch_id) => {
    if (ctx.auth.user_auth == 32){
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
        if (user.branch_id != branch_id){
            throw new HTTPException("You are not allowed to manage commodity to this branch", 10001)
        }
    }
}

router.get("/list", new Auth(32).m, async(ctx) => {
    // 从哪里开始
    let offset = ctx.request.query.offset
    // 显示几个
    let limit = ctx.request.query.limit
    let branch_id = ctx.request.query.branch_id

    if(!offset){
        offset = 0
    }
    if(!limit){
        limit = 10
    }

    let objects, all_count
    // 32是分店管理员. 没有权限查看其他分店的商品
    if (ctx.auth.user_auth == 32){
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
        if (user.branch_id != branch_id){
            throw new HTTPException("You are not allowed to view this branch's commodity", 10002)
        }
    }

    objects = await Commodity.findAll({
        where:{
            branch_id: branch_id
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['createdAt', 'DESC']
        ]
    })
    all_count = await Commodity.count({
        where:{
            branch_id: branch_id
        }
    })
    

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

router.post("/add", new Auth(32).m, async(ctx) => {
    let branch_id = ctx.request.body.branch_id
    let commodity_name = ctx.request.body.commodity_name
    let commodity_unit = ctx.request.body.commodity_unit
    let commodity_image = ctx.request.body.commodity_image
    let commodity_tag = ctx.request.body.commodity_tag
    let commodity_unit_price = ctx.request.body.commodity_unit_price
    let commodity_priority = ctx.request.body.commodity_priority

    if (ctx.auth.user_auth == 32){
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
        if (user.branch_id != branch_id) {
            throw new HTTPException("You are not allowed to manage commodity to this branch", 10007)
        }
    }

    await Commodity.create({
        branch_id,
        commodity_name,
        commodity_unit,
        commodity_image,
        commodity_sales: 0,
        commodity_tag,
        commodity_unit_price,
        commodity_is_hot: false,
        commodity_priority,
        commodity_is_online: true,
       
    })

    ctx.body = {
        code: 0,
        msg: "Commodity added successfully"
    }

})

router.put("/update", new Auth(32).m, async(ctx) => {
    let branch_id = ctx.request.body.branch_id
    let commodity_id = ctx.request.body.commodity_id
    let commodity_name = ctx.request.body.commodity_name
    let commodity_unit = ctx.request.body.commodity_unit
    let commodity_image = ctx.request.body.commodity_image
    let commodity_tag = ctx.request.body.commodity_tag
    let commodity_unit_price = ctx.request.body.commodity_unit_price
    let commodity_priority = ctx.request.body.commodity_priority
    
    let commodity = await Commodity.findOne({
        where:{
            commodity_id: commodity_id
        }
    })
    if(!commodity){
        throw new HTTPException("This commodity does not exist", 10002)
    }
    await checkAuth(ctx, commodity.branch_id)
    await commodity.update({
        branch_id,
        commodity_name,
        commodity_unit,
        commodity_image,
        commodity_tag,
        commodity_unit_price,
        commodity_priority,
    })

    ctx.body = {
        code: 0,
        msg: "Commodity updated successfully"
    }

})


router.put("/update_tags", new Auth(32).m, async(ctx) => {
    let commodity_id = ctx.request.body.commodity_id
    let commodity_tag = ctx.request.body.commodity_tag
    
   
    let commodity = await Commodity.findOne({
        where:{
            commodity_id: commodity_id
        }
    })
    if(!commodity){
        throw new HTTPException("This commodity does not exist", 10002)
    }

    await checkAuth(ctx, commodity.branch_id)

    await commodity.update({
        commodity_tag,

    })

    ctx.body = {
        code: 0,
        msg: "Commodity tags updated successfully"
    }

})


router.put("/online", new Auth(32).m, async(ctx) => {
    let commodity_id = ctx.request.body.commodity_id
    let commodity = await Commodity.findOne({
        where:{
            commodity_id: commodity_id
        }
    })
    if (!commodity){
        throw new HTTPException("Commodity does not exist", 10002)
    }
    await checkAuth(ctx, commodity.branch_id)

    if (commodity.commodity_is_online){
        throw new HTTPException("Commodity is already online", 10002)
    }
    await commodity.update({
        commodity_is_online: true
    })
    ctx.body = {
        code: 0,
        msg: "Commodity is online now"
    }
})

router.put("/offline", new Auth(32).m, async(ctx) => {
    let commodity_id = ctx.request.body.commodity_id
    let commodity = await Commodity.findOne({
        where:{
            commodity_id: commodity_id
        }
    })
    if (!commodity_id){
        throw new HTTPException("Commodity does not exist", 10002)
    }
    await checkAuth(ctx, commodity.branch_id)
    if (!commodity.commodity_is_online){
        throw new HTTPException("Commodity is already offline", 10002)
    }
    await commodity.update({
        commodity_is_online: false
    })
    ctx.body = {
        code: 0,
        msg: "Commodity is offline now"
    }
})

router.put("/onhot", new Auth(32).m, async(ctx) => {
    let commodity_id = ctx.request.body.commodity_id
    let commodity = await Commodity.findOne({
        where:{
            commodity_id: commodity_id
        }
    })
    if (!commodity){
        throw new HTTPException("Commodity does not exist", 10002)
    }
    await checkAuth(ctx, commodity.branch_id)

    if (commodity.commodity_is_hot){
        throw new HTTPException("Commodity is already on the hot list", 10002)
    }
    await commodity.update({
        commodity_is_hot: true
    })
    ctx.body = {
        code: 0,
        msg: "Commodity is on the hot list now"
    }
})

router.put("/offhot", new Auth(32).m, async(ctx) => {
    let commodity_id = ctx.request.body.commodity_id
    let commodity = await Commodity.findOne({
        where:{
            commodity_id: commodity_id
        }
    })
    if (!commodity_id){
        throw new HTTPException("Commodity does not exist", 10002)
    }
    await checkAuth(ctx, commodity.branch_id)
    if (!commodity.commodity_is_hot){
        throw new HTTPException("Commodity is already off the hot list", 10002)
    }
    await commodity.update({
        commodity_is_hot: false
    })
    ctx.body = {
        code: 0,
        msg: "Commodity is off the hot list now"
    }
})



module.exports = router
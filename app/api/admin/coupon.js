const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { Coupon } = require("../../../app/models/coupon")
const { HTTPException } = require("../../../core/http-exception")
const { UserCoupon } = require("../../models/user_coupon")
const { User } = require("../../models/user")
const router = new Router({
    prefix: "/admin/coupon",
})

router.post("/add", new Auth(64).m, async(ctx) => {
    let coupon_name = ctx.request.body.coupon_name
    let coupon_expire_type = ctx.request.body.coupon_expire_type
    let coupon_valid_days = ctx.request.body.coupon_valid_days
    let coupon_valid_start_date = ctx.request.body.coupon_valid_start_date
    let coupon_valid_end_date = ctx.request.body.coupon_valid_end_date 
    let coupon_type = ctx.request.body.coupon_type
    let coupon_limit_amount = ctx.request.body.coupon_limit_amount
    let coupon_reduction_amount = ctx.request.body.coupon_reduction_amount
    let coupon_discount_rate = ctx.request.body.coupon_discount_rate
    let coupon_count_limit = ctx.request.body.coupon_count_limit
    
    console.log({
        coupon_name,
        coupon_expire_type,
        coupon_valid_days,
        coupon_valid_start_date,
        coupon_valid_end_date,
        coupon_type,
        coupon_limit_amount,
        coupon_reduction_amount,
        coupon_discount_rate,
        coupon_count_limit
    
    })
    await Coupon.create({
        coupon_name,
        coupon_expire_type,
        coupon_valid_start_date,
        coupon_valid_end_date,
        coupon_valid_days,
        coupon_limit_amount,
        coupon_type,
        coupon_discount_rate,
        coupon_reduction_amount,
        coupon_count_limit

    })

    ctx.body = {
        code: 0,
        msg: "Coupon added successfully"
    }

})

router.put("/update", new Auth(64).m, async(ctx) => {
    let coupon_id = ctx.request.body.coupon_id

    let coupon_name = ctx.request.body.coupon_name
    let coupon_expire_type = ctx.request.body.coupon_expire_type
    let coupon_valid_days = ctx.request.body.coupon_valid_days
    let coupon_valid_start_date = ctx.request.body.coupon_valid_start_date
    let coupon_valid_end_date = ctx.request.body.coupon_valid_end_date 
    let coupon_type = ctx.request.body.coupon_type
    let coupon_limit_amount = ctx.request.body.coupon_limit_amount
    let coupon_reduction_amount = ctx.request.body.coupon_reduction_amount
    let coupon_discount_rate = ctx.request.body.coupon_discount_rate
    let coupon_count_limit = ctx.request.body.coupon_count_limit
   

    let coupon = await Coupon.findOne({
        where:{
            coupon_id: coupon_id
        }
    })

    if(!coupon){
        throw new HTTPException("Coupon does not exist", 10002)
    }

    await coupon.update({
        coupon_name,
        coupon_expire_type,
        coupon_valid_days,
        coupon_valid_start_date,
        coupon_valid_end_date,
        coupon_type,
        coupon_limit_amount,
        coupon_reduction_amount,
        coupon_discount_rate,
        coupon_count_limit

    })
    ctx.body = {
        code: 0,
        msg: "Coupon updated successfully"
    }
})

router.delete("/delete", new Auth(64).m, async(ctx) => {
    let coupon_id = ctx.request.query.coupon_id
    let coupon = await Coupon.findOne({
        where:{
            coupon_id: coupon_id
        }
    })
    if(!coupon){
        throw new HTTPException("This coupon does not exist", 10002)
    }
    await coupon.destroy()
    ctx.body = {
        code: 0,
        msg: "Coupon deleted successfully"
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

    let objects, all_count
    objects = await Coupon.findAll({
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['createdAt', 'DESC']
        ]
    })
    all_count = await Coupon.count({})
    

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

router.post("/distribute", new Auth(64).m, async(ctx) => {
    let coupon_id = ctx.request.body.coupon_id
    let user_phone = ctx.request.body.user_phone
    let user = await User.findOne({
        where:{
            user_phone: user_phone
        }
    })
    if(!user){
        throw new HTTPException("User does not exist", 10002)
    }
    let coupon = await Coupon.findOne({
        where:{
            coupon_id: coupon_id
        }
    })
    if(!coupon){
        throw new HTTPException("Coupon does not exist", 10002)
    }
    if (coupon.coupon_distributed_count >= coupon.coupon_count_limit){
        throw new HTTPException("This coupon has been distributed to the limit", 10002)
    }
    // dsitribute coupon to the user
    await coupon.increment("coupon_distributed_count")
    let user_coupon_valid_start_date = null
    let user_coupon_valid_end_date = null
    if (coupon.coupon_expire_type == "Fixed") {
        user_coupon_valid_start_date = coupon.coupon_valid_start_date
        user_coupon_valid_end_date = coupon.coupon_valid_end_date
    } else {
        user_coupon_valid_start_date = new Date(new Date().Format("yyyy-MM-dd 00:00:00"))
        user_coupon_valid_end_date = new Date(new Date(new Date().getTime() + coupon.coupon_valid_days * 24 * 60 * 60 * 1000).Format("yyyy-MM-dd 23:59:59"))
    }

    await UserCoupon.create({
        user_id: user.user_id,
        coupon_id: coupon.coupon_id,
        user_coupon_valid_start_date: user_coupon_valid_start_date,
        user_coupon_valid_end_date: user_coupon_valid_end_date,
        user_coupon_type: coupon.coupon_type,
        user_coupon_limit_amount: coupon.coupon_limit_amount,
        user_coupon_reduction_amount: coupon.coupon_reduction_amount,
        user_coupon_discount_rate: coupon.coupon_discount_rate,
        user_coupon_reduction_amount: coupon.coupon_reduction_amount,
        user_coupon_status: "UNUSED",
        user_coupon_name: coupon.coupon_name
    })
    ctx.body = {
        code: 0,
        msg: "Coupon distributed successfully"
    }

})

module.exports = router
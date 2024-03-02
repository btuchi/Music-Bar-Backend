const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { Branch } = require("../../../app/models/branch")
const { HTTPException } = require("../../../core/http-exception")
const { User } = require("../../../app/models/user")
const router = new Router({
    prefix: "/admin/branch",
})

router.post("/add", new Auth(32).m, async(ctx) => {
    let branch_name = ctx.request.body.branch_name
    let branch_address = ctx.request.body.branch_address
    let branch_latitude = ctx.request.body.branch_latitude
    let branch_longitude = ctx.request.body.branch_longitude
    let branch_phone = ctx.request.body.branch_phone
    let branch_open_time = ctx.request.body.branch_open_time
    let branch_close_time = ctx.request.body.branch_close_time
    let branch_seat_row = ctx.request.body.branch_seat_row
    let branch_seated_column = ctx.request.body.branch_seated_column
    let branch_one_seat_capacity = ctx.request.body.branch_one_seat_capacity
    let branch_one_seat_price = ctx.request.body.branch_one_seat_price

    await Branch.create({
        branch_name,
        branch_address,
        branch_latitude,
        branch_longitude,
        branch_phone,
        branch_open_time,
        branch_close_time,
        branch_seat_row,
        branch_seated_column,
        branch_one_seat_capacity,
        branch_one_seat_price,
    })

    ctx.body = {
        code: 0,
        msg: "Branch added successfully"
    }

})

router.put("/update", new Auth(32).m, async(ctx) => {
    let branch_id = ctx.request.body.branch_id

    let branch_name = ctx.request.body.branch_name
    let branch_address = ctx.request.body.branch_address
    let branch_latitude = ctx.request.body.branch_latitude
    let branch_longitude = ctx.request.body.branch_longitude
    let branch_phone = ctx.request.body.branch_phone
    let branch_open_time = ctx.request.body.branch_open_time
    let branch_close_time = ctx.request.body.branch_close_time
    let branch_seat_row = ctx.request.body.branch_seat_row
    let branch_seated_column = ctx.request.body.branch_seated_column
    let branch_one_seat_capacity = ctx.request.body.branch_one_seat_capacity
    let branch_one_seat_price = ctx.request.body.branch_one_seat_price
   

    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id
        }
    })
    if(!branch){
        throw new HTTPException("This branch does not exist", 10002)
    }

    if (ctx.auth.user_auth == 32){
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
        if (user.branch_id != branch_id) {
            throw new HTTPException("You are not allowed to update this branch", 10007)
        }
    }

    await branch.update({
        branch_name,
        branch_address,
        branch_latitude,
        branch_longitude,
        branch_phone,
        branch_open_time,
        branch_close_time,
        branch_seat_row,
        branch_seated_column,
        branch_one_seat_capacity,
        branch_one_seat_price,
    })
    ctx.body = {
        code: 0,
        msg: "Branch updated successfully"
    }
})

router.delete("/delete", new Auth(64).m, async(ctx) => {
    let branch_id = ctx.request.query.branch_id
    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id
        }
    })
    if(!branch){
        throw new HTTPException("This branch does not exist", 10002)
    }
    await branch.destroy()
    ctx.body = {
        code: 0,
        msg: "Branch deleted successfully"
    }
})

router.get("/list", new Auth(32).m, async(ctx) => {
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
    // 64是超级管理员. 显示全部
    if (ctx.auth.user_auth == 64){
        objects = await Branch.findAll({
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [
                ['createdAt', 'DESC']
            ]
        })
        all_count = await Branch.count()
    // 32是分店管理员. 只显示自己的分店
    } else {
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
    let branch_id = user.branch_id
    objects = await Branch.findAll({
        where:{
            branch_id: branch_id
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['createdAt', 'DESC']
        ]
    })
    all_count = await Branch.count({
        where:{
            branch_id: branch_id
        }
    })
    }

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

// 开业
router.put("/open", new Auth(32).m, async(ctx) => {
    let branch_id = ctx.request.body.branch_id
    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id
        }
    })
    if (!branch){
        throw new HTTPException("This branch does not exist", 10002)
    }

    if (ctx.auth.user_auth == 32){
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
        if (user.branch_id != branch_id) {
            throw new HTTPException("You are not allowed to change the status of this branch", 10007)
        }
    }

    await branch.update({
        branch_status: "OPEN"
    })
    ctx.body = {
        code: 0,
        msg: "This branch is open now"
    }
})

// 停业
router.put("/close", new Auth(32).m, async(ctx) => {
    let branch_id = ctx.request.body.branch_id
    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id
        }
    })
    if (!branch){
        throw new HTTPException("This branch does not exist", 10002)
    }

    if (ctx.auth.user_auth == 32){
        let user = await User.findOne({
            where:{
                user_id: ctx.auth.user_id
            }
        })
        if (user.branch_id != branch_id) {
            throw new HTTPException("You are not allowed to change the status of this branch", 10007)
        }
    }

    await branch.update({
        branch_status: "CLOSED"
    })
    ctx.body = {
        code: 0,
        msg: "This branch is closed now"
    }
})
module.exports = router
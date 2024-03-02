const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { Activity } = require("../../../app/models/activity")
const { HTTPException } = require("../../../core/http-exception")
const { Branch } = require("../../models/branch")
const { User } = require("../../models/user")
const router = new Router({
    prefix: "/admin/activity",
})

router.post("/add", new Auth(32).m, async(ctx) => {
    let activity_name = ctx.request.body.activity_name
    let activity_start_time = ctx.request.body.activity_start_time
    let activity_end_time = ctx.request.body.activity_end_time
    let activity_image = ctx.request.body.activity_image
    let activity_detail = ctx.request.body.activity_detail
    let branch_id = ctx.request.body.branch_id

    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id
        }
    })

    if (!branch){
        throw new HTTPException("This branch does not exist", 10002)
    }

    let user = await User.findOne({
        where:{
            user_id: ctx.auth.user_id
        }
    })

    if (user.user_type == "ADMIN" && branch_id != user.branch_id){
        throw new HTTPException("You are not allowed to add activity to this branch", 10002)
    }

    await Activity.create({
        activity_name,
        activity_start_time,
        activity_end_time,
        activity_image,
        activity_detail,
        branch_id
    })

    ctx.body = {
        code: 0,
        msg: "Activity added successfully"
    }

})

router.put("/update", new Auth(32).m, async(ctx) => {
    let activity_id = ctx.request.body.activity_id
    let activity_name = ctx.request.body.activity_name
    let activity_start_time = ctx.request.body.activity_start_time
    let activity_end_time = ctx.request.body.activity_end_time
    let activity_image = ctx.request.body.activity_image
    let activity_detail = ctx.request.body.activity_detail
    let branch_id = ctx.request.body.branch_id

    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id
        }
    })

    if (!branch){
        throw new HTTPException("This branch does not exist", 10002)
    }

    let user = await User.findOne({
        where:{
            user_id: ctx.auth.user_id
        }
    })
    if (user.user_type == "ADMIN" && branch_id != user.branch_id){
        throw new HTTPException("You are not allowed to update activity to this branch", 10002)
    }
   

    let activity = await Activity.findOne({
        where:{
            activity_id
        }
    })
    if(!activity){
        throw new HTTPException("This activity does not exist", 10002)
    }
    await activity.update({
        activity_name,
        activity_start_time,
        activity_end_time,
        activity_image,
        activity_detail,
        branch_id
    })
    ctx.body = {
        code: 0,
        msg: "Activity updated successfully"
    }
})

router.delete("/delete", new Auth(32).m, async(ctx) => {
    let activity_id = ctx.request.query.activity_id
    let activity = await Activity.findOne({
        where:{
            activity_id: activity_id
        }
    })
    let user = await User.findOne({
        where:{
            user_id: ctx.auth.user_id
        }
    })
    if (user.user_type == "ADMIN" && activity.branch_id != user.branch_id){
        throw new HTTPException("You are not allowed to delete activity to this branch", 10002)
    }
    if(!activity){
        throw new HTTPException("This activity does not exist", 10002)
    }
    await activity.destroy()
    ctx.body = {
        code: 0,
        msg: "Activity deleted successfully"
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

    // 根据不同的人, 看到的活动不一样

    let whereClause = {}
    let user = await User.findOne({
        where:{
            user_id: ctx.auth.user_id
        }
    })
    if (user.user_type == "ADMIN"){
        whereClause = {
            branch_id: user.branch_id
        }
    }
    

    let objects = await Activity.findAll({
        where: whereClause,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['createdAt', 'DESC']
        ],
        // 联表查询
        include: [{
            model: Branch,
            as: "branch",
            attributes: ['branch_name', 'branch_address']

        }]
    })

    let all_count = await Activity.count()

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
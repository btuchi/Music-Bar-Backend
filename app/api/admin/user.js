const Router = require("koa-router")
const {Auth} = require("../../../middlewares/auth")
const { User } = require("../../../app/models/user")
const { Branch } = require("../../../app/models/branch")
const { HTTPException } = require("../../../core/http-exception")
const CryptoJS = require("crypto-js")

const router = new Router({
    prefix: "/admin/user",
})

router.get("/list", new Auth(64).m, async(ctx) => {
    let offset = ctx.request.query.offset
    let limit = ctx.request.query.limit
    // search by user_type
    let user_type = ctx.request.query.user_type

    if(!offset){
        offset = 0
    }
    if(!limit){
        limit = 10
    }

    let objects = await User.findAll({
        paranoid: false,
        where: {
            user_type: user_type
        },
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: Branch,
            as: "branch",
            attributes: ['branch_name']
        }]
    })
    let all_count = await User.count({
        where: {
            user_type: user_type
        },
        paranoid: false
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


router.post("/add", new Auth(64).m, async(ctx) => {
    let user_name = ctx.request.body.user_name
    let user_password = ctx.request.body.user_password
    let user_phone = ctx.request.body.user_phone
    let user_email = ctx.request.body.user_email
    let user_type = ctx.request.body.user_type // SUPERADMIN, ADMIN
    let bind_branch_id = ctx.request.body.bind_branch_id
    if (user_type == "ADMIN" && !bind_branch_id){
        throw new HTTPException("Bind the admin to their belonged branch", 10001)
    }

    let user = await User.findOne({
        where:{
            user_name: user_name
        }
    })
    if(user){
        throw new HTTPException("User name already used", 10001)
    }
    
    if (user_type == "ADMIN"){
        user = await User.create({
            user_name,
            user_phone,
            user_email,
            user_type,
            branch_id: bind_branch_id
        })
    } else if (user_type == "SUPERADMIN"){
        user = await User.create({
            user_name,
            user_phone,
            user_email,
            user_type
        })
    }

    user_password = user.user_id + user_password
    user_password = CryptoJS.MD5(user_password).toString()

    await user.update({
        user_password
    })

    ctx.body = {
        code: 0,
        msg: "register success",
        data: {
            user_name: user.user_name
        }
    }
})
module.exports = router
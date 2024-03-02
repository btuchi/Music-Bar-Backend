const Router = require("koa-router")
const CryptoJS = require('crypto-js')
const { v4: uuidv4 } = require("uuid")
const router = new Router({
    prefix: "/user",
})

const { EmailCode } = require("../models/email_code")
const { User } = require("../models/user")
const {Auth} = require("../../middlewares/auth")
const {transporter} = require("../../util/email_util")
const {UserLoginValidator, UserRegisterValidator} = require("../validators/user_validator")
const { HTTPException } = require("../../core/http-exception")
const { create } = require("lodash")
const { TokenManager } = require("../../util/token_util")
const { Op } = require("sequelize")

async function createAdminUser(){
    let user = await User.findOne({
        where:{
            user_name:"admin"
        }
    })
    if(!user){
        await User.create({
            user_name:"admin",
            user_password: CryptoJS.MD5("1Admin12345").toString(),
            user_type: "SUPERADMIN"
        })
    }
}
createAdminUser()

router.post("/send_email_code", async(ctx) => {
    // Send user email verification code
    // 1. generate random verification code
    // 2. save the verification code in database
    // 3. send verification code to user email
    let email_address = ctx.request.body.email_address
    let email_code_content = Math.random().toString().slice(-6)
    // find if the email address has been registered
    let emailCode = await EmailCode.findOne({
        where:{
            email_address: email_address
        }
    
    })
    // if the email address has been registered, update the verification code
    if(emailCode){
        let email_code_expire_time = new Date(emailCode.email_code_expire_time)
        let now = new Date()

        if(email_code_expire_time > now){
            throw new HTTPException("Verification code has been sent, please check your email", 10006)
        } else {
            await emailCode.update({
                email_code_content,
                email_code_expire_time: new Date(new Date().getTime() + 3 * 60 * 1000)
            })

        }

    } else {
        // if the email address has not been registered, create a new record
        await EmailCode.create({
            email_address,
            email_code_content,
            email_code_expire_time: new Date(new Date().getTime() + 3 * 60 * 1000)
        })
    
    }
    // send verification code to user email
    try {
        const info = await transporter.sendMail({
            from: '"Music Bar" <bryce2tuhua@gmail.com>', // sender address
            to: email_address, // list of receivers
            subject: "Music Bar Verification Code", // Subject line
            text: `Hello, your verification code is: ${email_code_content}. The code is expiring in 3 minutes`, // plain text body
    });
    } catch (error) {
        console.log(error)
        throw new HTTPException("Failed to send verification code", 10008)
    }
        ctx.body = {
            code: 0,
            msg: "success"
        }
})

router.post("/register", async(ctx) => {
    // 1. 接受并校验参数
    // 2. 根据参数在数据库中创建记录
    // 3. 返回成功
    const v = await new UserRegisterValidator().validate(ctx)
    let user_name = v.get("body.user_name")
    let user_password = v.get("body.user_password")
    let user_phone = v.get("body.user_phone")
    let user_email = v.get("body.user_email")
    console.log("user_name",user_name)
    console.log("user_password",user_password)

    let user = await User.findOne({
        where:{
            user_name: user_name
        }
    })
    if(user){
        throw new HTTPException("User name already used", 10001)
    }
    user = await User.create({
        user_name,
        user_phone,
        user_email,
        user_avatar:"default_avatar.jpeg"
    })

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

router.get("/info", new Auth(16).m, async(ctx) => {

    let user_id = ctx.auth.user_id
    console.log("user_id",user_id)
    let user = await User.findOne({
        where:{
            user_id:user_id
        }
    })
    if(!user){
        throw new HTTPException("user does not exist", 10002)
    }

    ctx.body = {
        code: 0,
        msg:"success",
        data: {
            user_name: user.user_name,
            user_avatar: user.user_avatar,
            user_type: user.user_type
        }
    }
})

router.post("/login", async(ctx) => {
    // 1. 支持 用户名/手机号 和 密码登录
    // 2.  未来还要支持微信小程序用户登录
    // 3. 登录成功后，返回token
    const v = await new UserLoginValidator().validate(ctx)
    let account = v.get("body.account")
    let password = v.get("body.password")
    let type = v.get("body.type")
    if (type == "100") { // 用户名/手机号登录
        // 根据用户名/手机号在数据库中查找用户
        let user = await User.findOne({
            where:{
                [Op.or]:[
                    {
                        user_name: account
                    },
                    {
                        user_phone: account
                    }
                ]
            }
        })
        if(!user){
            throw new HTTPException("user does not exist", 10002)
        }
        let cryptedText = CryptoJS.MD5(user.user_id + password).toString()
        if(cryptedText != user.user_password){
            throw new HTTPException("wrong password", 10003)
        } else {
            let token = await TokenManager.generateAccessToken(user.user_id, user.user_type)
            ctx.body = {
                code: 0,
                msg: "success",
                data: {
                    token,
                    user_name: user.user_name,
                    user_type: user.user_type
                }
            }
        }

    } else if (type == '101') { // 微信登录
        throw new HTTPException("not supported yet", 10005)
    } else if (type == '102') { // 邮箱登录
        let email_address = account
        let email_code_content = password
        // find if the email address has been registered 
        // and if the verification code is correct
        let emailCode = await EmailCode.findOne({
            where:{
                email_address,
                email_code_content
            }
        })
        if(!emailCode){
            throw new HTTPException("wrong verification code", 10003)
        }

        let email_code_expire_time = new Date(emailCode.email_code_expire_time)
        let now = new Date()
        if(email_code_expire_time < now){
            throw new HTTPException("verification code expired", 10004)
        }
        // find if the email address has been registered
        let user = await User.findOne({
            where:{
                user_email: email_address
            }
        })
        // if the email address has not been registered, create a new record
        if(!user){
            user = await User.create({
                user_email: email_address,
                user_type: "USER",
                user_name: "email_user" + uuidv4(),
                user_avatar:"default_avatar.jpeg"
            })
        }
        // generate token
        let token = await TokenManager.generateAccessToken(user.user_id, user.user_type)
        ctx.body = {
            code: 0,
            msg: "success",
            data: {
                token
            }
        }
    }  
})

router.put("/modify_avatar", new Auth(16).m, async(ctx) => {
    let user_avatar = ctx.request.body.user_avatar
    let user_id = ctx.auth.user_id
    console.log(user_avatar)
    let user = await User.findOne({
        where:{
            user_id:user_id
        }
    })
    await user.update({
        user_avatar
    })
    ctx.body = {
        code: 0,
        msg: "success"
    }
})


router.get("/list", new Auth(64).m, async(ctx) => {
    let offset = ctx.request.query.offset
    let limit = ctx.request.query.limit

    if(!offset){
        offset = 0
    }
    if(!limit){
        limit = 10
    }

    let objects = await User.findAll({
        paranoid: false,
        offset: parseInt(offset),
        limit: parseInt(limit),
        order: [
            ['createdAt', 'DESC']
        ]
    })
    let all_count = await User.count({
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

router.delete("/delete", new Auth(64).m, async(ctx) => {
    const user_id = ctx.request.query.user_id
    let user = await User.findOne({
        where:{
            user_id:user_id
        }
    })  
    if(!user){
        throw new HTTPException("user does not exist", 10002)
    }
    await user.destroy()
    ctx.body = {
        code: 0,
        msg: "success"
    }
})


router.put("/modify_pswd", new Auth(64).m, async(ctx) => {
    const user_id = ctx.request.body.user_id
    const user_password = ctx.request.body.user_password
    let user = await User.findOne({
        where:{
            user_id:user_id
        }
    })  
    if(!user){
        throw new HTTPException("user does not exist", 10002)
    }

    let user_password_new = user_id + user_password
    
    await user.update({
        user_password: CryptoJS.MD5(user_password_new).toString()
    })
    ctx.body = {
        code: 0,
        msg: "success"
    }
})

module.exports = router
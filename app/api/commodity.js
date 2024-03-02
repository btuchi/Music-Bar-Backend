const Router = require("koa-router")
const { Auth } = require("../../middlewares/auth")
const { Branch } = require("../../app/models/branch")
const { Commodity } = require("../../app/models/commodity")
const { HTTPException } = require("../../core/http-exception")
const { isArrayLikeObject } = require("lodash")
const { Op } = require("sequelize")

const router = new Router({
    prefix: "/commodity",
})

router.get("/list", async (ctx) => {
    let branch_id = ctx.request.query.branch_id
    let tag = ctx.request.query.tag
    let commodity_name = ctx.request.query.commodity_name
    let branch = await Branch.findOne({
        where: {
            branch_id
        }
    })
    if (!branch) {
        throw new HTTPException("Branch not found", 10002)
    }
    let where = {
        branch_id,
        commodity_is_online: true
    }

    if (tag == "热销") {
        where["commodity_is_hot"] = true
    } else if (tag == "全部") {

    } else {
        where["commodity_tag"] = {
            [Op.like]: `%${tag}%`
        }
    }
    if (commodity_name) {
        where["commodity_name"] = {
            [Op.like]: `%${commodity_name}%`
        }
    }

    let commodities = await Commodity.findAll({
        where: where,
        order: [
            ["commodity_is_hot", "DESC"]
        ]
    })
    ctx.body = {
        code: 0,
        msg: "success",
        data: commodities
    }

})

router.get("/type_list", new Auth(16).m, async (ctx) => {
    let branch_id = ctx.request.query.branch_id
    let branch = await Branch.findOne({
        where: {
            branch_id
        }
    })
    if (!branch) {
        throw new HTTPException("Branch not found", 10002)
    }
    let commodities = await Commodity.findAll({
        where: {
            branch_id: branch_id,
            commodity_is_online: true
        },
        attributes: ["commodity_tag"],
    })
    let tags = new Set()
    // Get all the tags of the commodities
    commodities.forEach(commodity => {
        let tag = commodity.commodity_tag
        if (tag) {
            tag.split(",").forEach(tag => {
                tags.add(tag)
            })
        }
    })
    tags = Array.from(tags)
    tags.unshift("热销")
    tags.unshift("全部")
    ctx.body = {
        code: 0,
        msg: "success",
        data: tags
    }
})

router.post("/calculate_price", new Auth(16).m, async (ctx) => {
    let shopping_cart = ctx.request.body.shopping_cart
    let total_price = 0
    let total_count = 0
    let info_list = []
    for (let commodity_id in shopping_cart) {
        let commodity = await Commodity.findOne({
            where: {
                commodity_id: commodity_id
            }
        })
        if (!commodity) {
            throw new HTTPException("Commodity does not exist", 10002)
        }
        info_list.push({
            commodity_id: commodity.commodity_id,
            commodity_name: commodity.commodity_name,
            commodity_image: commodity.commodity_image,
            commodity_total_price: commodity.commodity_unit_price * shopping_cart[commodity_id],
            commodity_count: shopping_cart[commodity_id],

        })
        total_price += commodity.commodity_unit_price * shopping_cart[commodity_id]
        total_count += shopping_cart[commodity_id]
    }
    ctx.body = {
        code: 0,
        msg: "success",
        data: {
            total_price,
            total_count,
            info_list
        }
    }
}),
    module.exports = router
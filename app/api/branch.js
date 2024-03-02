const Router = require("koa-router")
const {Auth} = require("../../middlewares/auth")
const { Branch } = require("../../app/models/branch")
const { HTTPException } = require("../../core/http-exception")

const router = new Router({
    prefix: "/branch",
})
router.get("/list", async(ctx) => {
    let latitude = ctx.request.query.latitude
    let longitude = ctx.request.query.longitude
    let branches = await Branch.findAll({
        where:{
            branch_status: "OPEN"
        }
    })
    if (!latitude || !longitude) {
        ctx.body = {
            code: 0,
            msg: "success",
            data: branches
        }
        return
    }
    // Calculate the distance between the user's location and the branch
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        let R = 6371; // km
        let dLat = (lat2 - lat1) * Math.PI / 180;
        let dLon = (lon2 - lon1) * Math.PI / 180;
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d;
    }
    for (let i = 0; i < branches.length; i++) {
        branches[i].dataValues.distance = calculateDistance(latitude, longitude, branches[i].branch_latitude, branches[i].branch_longitude)
    }
    branches.sort((branchA, branchB) => {
        return branchA.dataValues.distance - branchB.dataValues.distance
    })
    ctx.body = {
        code: 0,
        msg: "success",
        data: branches
    }
})
router.get("/closest", async(ctx) => {
    let latitude = ctx.request.query.latitude
    let longitude = ctx.request.query.longitude
    let branches = await Branch.findAll({
        where: {
            branch_status: "OPEN"
        },
        attributes: ["branch_id", "branch_name","branch_latitude", "branch_longitude"],
    })
    if (!latitude || !longitude) {
        ctx.body = {
            code: 0,
            msg: "success",
            data: branches[0]
        }
        return
    }
    // Calculate the distance between the user's location and the branch
    let min_dis = 100000000
    let closest_branch = branches[0]
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        let R = 6371; // km
        let dLat = (lat2 - lat1) * Math.PI / 180;
        let dLon = (lon2 - lon1) * Math.PI / 180;
        let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c;
        return d;
    }
    for (let i = 0; i < branches.length; i++) {
        let dis = calculateDistance(latitude, longitude, branches[i].branch_latitude, branches[i].branch_longitude)
        if (dis < min_dis) {
            min_dis = dis
            closest_branch = branches[i]
        }
    }   

    ctx.body = {
        code: 0,
        msg: "success",
        data: closest_branch
    }
})

router.get("/detail", async(ctx) => {
    let branch_id = ctx.request.query.branch_id
    let branch = await Branch.findOne({
        where:{
            branch_id: branch_id,
            branch_status: "OPEN"
        }
    })
    if (!branch) {
        throw new HTTPException("Branch does not exist", 10002)
    }

    ctx.body = {
        code: 0,
        msg: "success",
        data: branch
    }
})

module.exports = router
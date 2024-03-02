const Router = require("koa-router");
const { TokenManager } = require("../../util/token_util");
const router = new Router({
    prefix: "/token",
}); 


router.post("/validate", async (ctx) => {
    const token = ctx.request.body.token;
    const result = await TokenManager.verifyAccessToken(token);
    ctx.body = {
        code: 0,
        msg: "success",
        data: {
            res: result.res,
        },
    };
});

module.exports = router;


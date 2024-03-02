const Koa = require("koa2");
const app = new Koa();
const { log } = require('./middlewares/log')
const { timer } = require("./middlewares/timer");
const InitManager = require("./core/init-manager")
const parser = require("koa-bodyparser");
const { exceptionHandler } = require("./middlewares/exception-handler");
const config =  require("./config")
const serve = require('koa-static')

const cors = require("koa2-cors")
require("./app/models/import")
require("./util/date-util")


app.use(timer)
app.use(exceptionHandler)
app.use(cors())
app.use(parser())
app.use(log)
InitManager.initCore(app)
app.use(serve("./public", {}))
app.listen(3000)
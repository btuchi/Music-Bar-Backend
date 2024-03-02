const Router = require("koa-router")
const requireDirectory = require("require-directory")
class InitManager{
    static initCore(app){
        InitManager.initRoute(app)


    }

    static initRoute(app){
        const apiDirectory = `${process.cwd()}/app/api`;
        requireDirectory(module, apiDirectory, {
            visit: loadModule,
        });

        function loadModule(obj) {
            if (obj instanceof Router) {
                app.use(obj.routes());
            }
        }
    }
}

module.exports = InitManager
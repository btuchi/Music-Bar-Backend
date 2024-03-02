const {LinValidator, Rule} = require("../../util/validator-util")

class UserLoginValidator extends LinValidator {
    constructor() {
        super()
        this.account = [
            new Rule("isLength", "不符合规则", {
                min: 1,
                max: 40,
            }),
        ]

        this.password = [
            new Rule("isLength", "至少6个字符", {
                min: 6,
                max: 128,
            })
        ]
    }
    validateLoginType(vals){
        if(!vals.body.type){
            throw new Error("type是必须参数")
        }
        if(['100','101', '102'].indexOf(vals.body.type) == -1){
            throw new Error("type参数必须是100或者101")
        }
    }
}

class UserRegisterValidator extends LinValidator {
    constructor() {
        super()
        this.user_name = [
            new Rule("isLength", "不符合规则", {
                min: 1,
                max: 40,
            }),
        ]

        this.user_password = [
            new Rule("isLength", "至少6个字符", {
                min: 6,
                max: 128,
            })
        ]

        this.user_phone = [
            new Rule("isLength", "不符合规则", {
                min: 1,
                max: 40,
            }),
        ]
        this.user_email = [
            new Rule("isLength", "不符合规则", {
                min: 1,
                max: 40,
            }),
        ]
    }

}

module.exports = {
    UserLoginValidator,
    UserRegisterValidator
}
const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class EmailCode extends Model{

}

EmailCode.init({
    email_code_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email_address:{
        type: Sequelize.STRING(64),
    },
    email_code_content:{
        type: Sequelize.STRING(64),
    },
    email_code_expire_time:{
        type: Sequelize.DATE,
    },
}, { sequelize: db, tableName: "email_code"});


module.exports = { EmailCode }
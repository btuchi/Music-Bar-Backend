const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class User extends Model{

}

User.init({
    // 基本用户属性
    user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_name:{
        type: Sequelize.STRING(64),
        defaultValue: "anonymous user"
    },
    user_password:{
        type: Sequelize.STRING
    },
    user_type:{
        type: Sequelize.ENUM('USER', 'ADMIN', 'SUPERADMIN'),
        defaultValue: 'USER'
    },
    user_avatar:{
        type: Sequelize.STRING,
        default: null,
        get(){
            const rawValue = this.getDataValue("user_avatar")
            return rawValue ? `${config.server_url}${rawValue}` :null
        }
    },
    user_points:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    user_phone:{
        type: Sequelize.STRING(30),
        defaultValue: null
    },
    user_accumulated_points:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    user_birthday:{
        type: Sequelize.DATE,
    },
    user_balance:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    user_email:{
        type: Sequelize.STRING(64),
    },

}, { sequelize: db, tableName: "user"});

module.exports = { User }
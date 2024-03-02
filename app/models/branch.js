const { db } = require("../../core/database")
const config  = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Branch extends Model{

}

Branch.init({
    // 基本用户属性
    branch_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    branch_name:{
        type: Sequelize.STRING(64),
    },
    branch_address:{
        type: Sequelize.STRING(64),
    },
    branch_latitude:{
        type: Sequelize.FLOAT,
    },
    branch_longitude:{
        type: Sequelize.FLOAT,
    },
    branch_phone:{
        type: Sequelize.STRING,
    },
    branch_open_time:{
        type: Sequelize.STRING,
        comment:"开始营业时间, 格式 HH:MM"
    },
    branch_close_time:{
        type: Sequelize.STRING,
        comment:"结束营业时间, 格式 HH:MM"
    },
    branch_seat_row:{
        type: Sequelize.INTEGER,
    },
    branch_seated_column:{
        type: Sequelize.INTEGER,
    },
    branch_one_seat_capacity:{
        type: Sequelize.INTEGER,
    },
    branch_one_seat_price:{
        type: Sequelize.INTEGER,
    },
    branch_status:{
        type: Sequelize.ENUM('OPEN', 'CLOSED'),
        defaultValue: 'OPEN'
    },  

}, { sequelize: db, tableName: "branch"});

module.exports = { Branch }
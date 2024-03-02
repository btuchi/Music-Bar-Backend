const { db } = require("../../core/database")
const config  = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Activity extends Model{

}

Activity.init({
    activity_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    activity_name:{
        type: Sequelize.STRING(64),
    },
    activity_start_time:{
        type: Sequelize.DATE,
    },
    activity_end_time:{
        type: Sequelize.DATE,
    },
    activity_image:{
        type: Sequelize.STRING,
        defaultValue: null,
        get(){
            const rawValue = this.getDataValue("activity_image")
            return rawValue ? `${config.server_url}${rawValue}` :null
        }
    },
    activity_detail:{
        type: Sequelize.STRING,
        defaultValue: null
    },

}, { sequelize: db, tableName: "activity"});

module.exports = { Activity }
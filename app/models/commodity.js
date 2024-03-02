const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Commodity extends Model{

}

Commodity.init({

    commodity_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    commodity_name:{
        type: Sequelize.STRING(64),
    },
    commodity_unit:{
        type: Sequelize.STRING(64),
        defaultValue: "份"
    },
    commodity_image:{
        type: Sequelize.STRING,
        defaultValue: null,
        get(){
            const rawValue = this.getDataValue("commodity_image")
            return rawValue ? `${config.server_url}${rawValue}` :null
        }
    },
    commodity_sales:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    commodity_tag:{
        type: Sequelize.STRING,
        defaultValue: null
    },
    commodity_unit_price:{
        type: Sequelize.INTEGER,
    },
    commodity_is_hot:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
    commodity_priority:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    commodity_is_online:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
}, { sequelize: db, tableName: "commodity"});

module.exports = { Commodity }
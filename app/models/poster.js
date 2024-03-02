const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Poster extends Model{

}

Poster.init({
    poster_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    poster_image:{
        type: Sequelize.STRING,
        defaultValue: null,
        get(){
            const rawValue = this.getDataValue("poster_image")
            return rawValue ? `${config.server_url}${rawValue}` :null
        }
    },
    poster_priority:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    poster_is_online:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
    },
}, { sequelize: db, tableName: "poster"});

module.exports = { Poster }
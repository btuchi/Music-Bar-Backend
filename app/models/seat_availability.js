const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class SeatAvailability extends Model{

}

SeatAvailability.init({

    seat_availability_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    seat_availability_date:{
        type: Sequelize.DATE,
    },
    seat_availability_info:{
        type: Sequelize.STRING(1000),
    },


}, { sequelize: db, tableName: "seat_availability"});

module.exports = { SeatAvailability }
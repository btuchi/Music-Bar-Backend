const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Reservation extends Model{

}

Reservation.init({
    reservation_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    reservation_no:{
        type: Sequelize.STRING(64),
    },
    reservation_remark:{
        type: Sequelize.STRING(64),
    },
    reservation_status:{
        type: Sequelize.ENUM('UNUSED', 'RESERVED', 'CANCELED'),
        defaultValue: 'UNUSED'
    },
    reservation_date:{
        type: Sequelize.DATE,
    },
    reservation_seat:{
        type: Sequelize.STRING,
    },
}, { sequelize: db, tableName: "reservation"});

module.exports = { Reservation }
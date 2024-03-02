const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Order extends Model{

}

Order.init({
    order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    order_no: {
        type: Sequelize.STRING(64),
    },
    order_price: {
        type: Sequelize.INTEGER,
    },
    order_remark: {
        type: Sequelize.STRING(64),
    },
    order_payment_method:{
        type: Sequelize.ENUM('PAYPAL', 'WALLET'),
        defaultValue: 'PAYPAL'
    },
    order_status:{
        type: Sequelize.ENUM('UNPAID', 'PAID', 'CANCELED'),
        defaultValue: 'UNPAID'
    },
    order_commodity_info:{
        type: Sequelize.STRING(1000),
    },

}, { sequelize: db, tableName: "order"});

module.exports = { Order }
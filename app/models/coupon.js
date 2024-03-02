const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class Coupon extends Model{

}

Coupon.init({
    coupon_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    coupon_name:{
        type: Sequelize.STRING(64),
    },
    coupon_expire_type:{
        type: Sequelize.ENUM('FIXED', 'DYNAMIC'),
        defaultValue: 'FIXED'
    },
    coupon_valid_days:{
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    coupon_valid_start_date:{
        type: Sequelize.DATE,
    },
    coupon_valid_end_date:{
        type: Sequelize.DATE,
    },
    coupon_type:{
        type: Sequelize.ENUM('DISCOUNT', 'REDUCTION'),
        defaultValue: 'DISCOUNT'
    },
    coupon_limit_amount:{
        type: Sequelize.INTEGER,
        comment: "限制使用金额"
    },
    coupon_reduction_amount:{
        type: Sequelize.INTEGER,
        comment: "减免金额"
    },
    coupon_discount_rate:{
        type: Sequelize.FLOAT,
        comment: "折扣率"
    },
    coupon_count_limit:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: "限制发放数量"
    },
    coupon_distributed_count:{
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: "已经发放数量"
    },

}, { sequelize: db, tableName: "coupon"});

module.exports = { Coupon }
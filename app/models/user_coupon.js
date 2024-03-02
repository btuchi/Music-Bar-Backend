const { db } = require("../../core/database")
const config = require("../../config")
const {Sequelize, Model} = require("sequelize")

class UserCoupon extends Model{

}

UserCoupon.init({
    user_coupon_id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_coupon_name:{
        type: Sequelize.STRING(64),
    },
    user_coupon_valid_start_date:{
        type: Sequelize.DATE,
    },
    user_coupon_valid_end_date:{
        type: Sequelize.DATE,
    },
    user_coupon_type:{
        type: Sequelize.ENUM('DISCOUNT', 'REDUCTION'),
        defaultValue: 'DISCOUNT'
    },
    user_coupon_limit_amount:{
        type: Sequelize.INTEGER,
        comment: "限制使用金额 (该优惠券在满足多少金额后才可以使用)"
    },
    user_coupon_reduction_amount:{
        type: Sequelize.INTEGER,
        comment: "减免金额"
    },
    user_coupon_discount_rate:{
        type: Sequelize.FLOAT,
        comment: "折扣率"
    },
    user_coupon_status:{
        type: Sequelize.ENUM('UNUSED', 'USED', 'EXPIRED'),
        defaultValue: 'UNUSED'
    },

}, { sequelize: db, tableName: "user_coupon"});

module.exports = { UserCoupon }
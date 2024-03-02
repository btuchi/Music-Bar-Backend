const {User} = require("../models/user")
const{Branch} = require("../models/branch")
const{Commodity} = require("../models/commodity")
const{Activity} = require("../models/activity")
const{Reservation} = require("../models/reservation")
const{SeatAvailability} = require("../models/seat_availability")
const{Coupon} = require("../models/coupon")
const{UserCoupon} = require("../models/user_coupon")
const { Order } = require("../models/order")
const { Poster } = require("../models/poster")
const { EmailCode } = require("../models/email_code")
Branch.hasMany(User, {
    foreignKey: "branch_id",
    sourceKey: "branch_id",
    as: "users"
})


User.belongsTo(Branch, {
    foreignKey: "branch_id",
    targetKey: "branch_id",
    as: "branch"
})

Branch.hasMany(Commodity, {
    foreignKey: "branch_id",
    sourceKey: "branch_id",
    as: "commodities"
})

Commodity.belongsTo(Branch, {
    foreignKey: "branch_id",
    targetKey: "branch_id",
    as: "branch"
})

Branch.hasMany(Activity, {
    foreignKey: "branch_id",
    sourceKey: "branch_id",
    as: "activities"
})

Activity.belongsTo(Branch, {
    foreignKey: "branch_id",
    targetKey: "branch_id",
    as: "branch"
}) 

Activity.hasMany(Reservation, {
    foreignKey: "activity_id",
    sourceKey: "activity_id",
    as: "reservations"
})

Reservation.belongsTo(Activity, {
    foreignKey: "activity_id",
    targetKey: "activity_id",
    as: "activity"
})

User.hasMany(Reservation, {
    foreignKey: "user_id",
    sourceKey: "user_id",
    as: "reservations"
})

Reservation.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "user"
})

Activity.hasMany(SeatAvailability, {
    foreignKey: "activity_id",
    sourceKey: "activity_id",
    as: "seat_availabilities"
})

SeatAvailability.belongsTo(Activity, {
    foreignKey: "activity_id",
    targetKey: "activity_id",
    as: "activity"
})

Coupon.hasMany(UserCoupon, {
    foreignKey: "coupon_id",
    sourceKey: "coupon_id",
    as: "user_coupons"
})

UserCoupon.belongsTo(Coupon, {
    foreignKey: "coupon_id",
    targetKey: "coupon_id",
    as: "coupon"
})

User.hasMany(UserCoupon, {
    foreignKey: "user_id",
    sourceKey: "user_id",
    as: "user_coupons"
})

UserCoupon.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "user"
})

Branch.hasMany(Order, {
    foreignKey: "branch_id",
    sourceKey: "branch_id",
    as: "orders"
})

Order.belongsTo(Branch, {
    foreignKey: "branch_id",
    targetKey: "branch_id",
    as: "branch"
})

User.hasMany(Order, {
    foreignKey: "user_id",
    sourceKey: "user_id",
    as: "orders"
})

Order.belongsTo(User, {
    foreignKey: "user_id",
    targetKey: "user_id",
    as: "user"
})

Order.hasOne(UserCoupon, {
    foreignKey: "order_id",
    sourceKey: "order_id",
    as: "user_coupon"
})

UserCoupon.belongsTo(Order, {
    foreignKey: "order_id",
    targetKey: "order_id",
    as: "order"
})




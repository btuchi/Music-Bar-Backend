const Sequelize = require('sequelize')
const config = require("../config");
// ORM object
const sequelize = new Sequelize(config.database.name, config.database.username, config.database.password, {
    host: config.database.host,
    port: config.database.port,
    dialect: 'mysql',
    logging: true,
    timezone: "+08:00",
    dialectOptions: {
    },

    // 软删除
    define: {
        timestamps: true,
        paranoid: true,
        underscored: true, // 驼峰转_写法
        scopes: {
        }
    },
  });


sequelize.sync({ force: false });

module. exports = {
    db: sequelize,
};



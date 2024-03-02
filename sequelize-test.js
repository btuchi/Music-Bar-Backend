
const Sequelize = require('sequelize')

const sequelize = new Sequelize('test2', 'root', 'cctt18858112252', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  });

async function test(){
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

test()
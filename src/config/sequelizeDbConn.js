const { Sequelize } = require("sequelize");
require("dotenv").config();


sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mssql",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      options: {
        encrypt: false,
      },
    },
  }
);

module.exports = sequelize;
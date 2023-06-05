const { Sequelize, DataTypes } = require("sequelize");
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

class Table {
  constructor(tableName, schema) {
    this.tableName = tableName;
    this.schema = schema;
  }

  defineModel() {
    return sequelize.define(this.tableName, this.schema);
  }

  async createTable() {
   await this.defineModel().sync({ force: true });
   await this.defineModel().sync()
   // console.log(`Table ${this.tableName} created.`);
    return this.defineModel();
  }
}

module.exports = Table;

const sql = require("mssql");

class DBService {
  constructor() {
    this.pool = null;
  }

  async connect(config) {
    try {
      this.pool = await sql.connect(config);
      console.log("Connected to the database");
    } catch (error) {
      console.error("Error connecting to the database:", error);
    }
  }

  getConnection() {
    return this.pool;
  }

  config = {
    server: process.env.DB_HOST,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: 1433,
    options: {
      encrypt: false,
    },
  };
}

module.exports = new DBService();

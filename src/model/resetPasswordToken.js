const { DataTypes, Sequelize } = require("sequelize");
const Table = require("../config/sequelizeDbConn");

class ResetPasswordRepository {
  resetPasswordRepository;
  constructor() {
    this.tableSync();
  }

  async tableSync() {
    this.resetPasswordRepository = await new Table("ResetPassword", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
      },

      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
      }
    }).createTable();
  }
  catch(error) {
    console.error("Unable to connect to the database:", error);
  }
}



module.exports = ResetPasswordRepository;



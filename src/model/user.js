const { DataTypes, Sequelize } = require("sequelize");
const Table = require("../config/sequelizeDbConn");

class UserRepository {
  userRepository;
  constructor() {
    this.tableSync();
  }

  async tableSync() {
    this.userRepository = await new Table("User", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true,
        unique:true
      },
      country: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
      },
    }).createTable();
  }
  catch(error) {
    console.error("Unable to connect to the database:", error);
  }
}



module.exports = UserRepository;



const { DataTypes, Sequelize } = require("sequelize");
const Table = require("../config/sequelizeDbConn");

class UserRoleRepository {
  userRoleRepository;
  constructor() {
    this.tableSync();
  }

  async tableSync() {
    this.userRoleRepository = await new Table("UserRole", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      roleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Roles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    }).createTable();
  }

  catch(error) {
    console.error("Unable to connect to the database:", error);
  }
}

module.exports = UserRoleRepository;
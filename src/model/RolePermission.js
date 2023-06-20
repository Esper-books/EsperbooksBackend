const { DataTypes, Sequelize } = require("sequelize");
const Table = require("../config/sequelizeDbConn");

class RolePermissionRepository {
  rolePermissionRepository;
  constructor() {
    this.tableSync();
  }

  async tableSync() {
    this.rolePermissionRepository = await new Table("RolePermission", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
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
      permissionsId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Permissions",
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

module.exports = RolePermissionRepository;
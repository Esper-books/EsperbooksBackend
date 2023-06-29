const { DataTypes, Sequelize ,Model} = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");

class RolePermissionRepository extends Model {}
  RolePermissionRepository.init({
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
    },
    {
      sequelize,
      modelName: "RolePermission",
    });

RolePermissionRepository.sync();
module.exports = RolePermissionRepository;
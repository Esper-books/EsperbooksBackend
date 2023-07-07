const { DataTypes, Sequelize ,Model } = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");

class UserRolesPermissionRepository extends Model {}
UserRolesPermissionRepository.init({
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userRoleId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "UserRoles",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      permissionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Permissions",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "UserRolesPermission",
    });


UserRolesPermissionRepository.sync();
module.exports = UserRolesPermissionRepository;
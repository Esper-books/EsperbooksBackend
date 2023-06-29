const { DataTypes, Sequelize ,Model } = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");

class UserRoleRepository extends Model {}
  UserRoleRepository.init({
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
    },
    {
      sequelize,
      modelName: "UserRole",
    });


    UserRoleRepository.sync();
module.exports = UserRoleRepository;
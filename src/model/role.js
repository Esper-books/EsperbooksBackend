const { DataTypes, Sequelize,Model } = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");

class RoleRepository extends Model {}
  RoleRepository.init({
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: "Role",
    });
    
    RoleRepository.sync();
module.exports = RoleRepository;



const { DataTypes, Sequelize , Model } = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");

class ResetPasswordRepository extends Model {}
  ResetPasswordRepository.init({
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
    },
    {
      sequelize,
      modelName: "ResetPassword",
    });


    ResetPasswordRepository.sync();

module.exports = ResetPasswordRepository;



const { DataTypes, Sequelize } = require("sequelize");
const Table = require("../config/sequelizeDbConn");

class RoleRepository {
  roleRepository;
  constructor() {
    this.tableSync();
  }

  async tableSync() {
    this.roleRepository = await new Table("Role", {
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
    }).createTable();
    
  }
  catch(error) {
    console.error("Unable to connect to the database:", error);
  }
}





module.exports = RoleRepository;



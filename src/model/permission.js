const { DataTypes, Sequelize } = require("sequelize");
const Table = require("../config/sequelizeDbConn");


class PermissionRepository {
  permissionRepository;
  constructor() {
    this.tableSync();
  }

  async tableSync() {
    this.permissionRepository = await new Table("Permission", {
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

(async () => {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const constraintExists = await queryInterface.showConstraint('Permissions', 'Permission_unique_id_roleId');

    if (constraintExists) {
      console.log('Permission_unique_id_roleId Constraint already exists!');
    } else {
      await queryInterface.addConstraint('Permissions', {
        fields: ['id', 'roleId'],
        type: 'unique',
        name: 'Permission_unique_id_roleId'
      });

      console.log('Permission_unique_id_roleId Constraint added successfully!');
    }
  } catch (error) {
    console.error('Error adding constraint:', error);
  }
})();


module.exports = PermissionRepository;

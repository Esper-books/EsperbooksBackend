const { DataTypes, Sequelize ,Model} = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");


class PermissionRepository extends Model {}
  PermissionRepository.init( 
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      permissionName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      }
    },
    {
      sequelize,
      modelName: "Permission",
    });

   PermissionRepository.sync({ force: false });

  



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

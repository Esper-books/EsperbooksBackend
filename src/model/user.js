//const { Sequelize, DataTypes } = require('sequelize');
//const { sequelize,Sequelize, defineModel,DataTypes } = require('../config/sequelizeDbConn');
const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('../config/sequelizeDbConn');


const User = sequelize.define('User', 
{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dateOfBirth: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
} );

sequelize.sync();

module.exports = User


// sequelize.queryInterface.describeTable('users')
//   .then(tableDefinition => {
//     if (!tableDefinition['companyToken']) {
//       // If the column does not exist, add it
//       return sequelize.queryInterface.addColumn('users', 'companyToken', {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true
//       });
//     }
//   })
//   .then(() => {
//     console.log('Column added successfully');
//   })
//   .catch(error => {
//     console.error('Error adding column', error);
//   });




// sequelize.sync();



// module.exports = 
//   {
//   User : User
//  }

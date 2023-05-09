var mysql = require('mysql');
const configs = require('../../config/config');



const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('mysql://remsaw:password@localhost:3306/esperbook');



const Company = sequelize.define('Company', 
{
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  size: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phoneNumber: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyType: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyAddress: {
    type: DataTypes.STRING,
    allowNull: false
  },
  companyBriefOverview: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyToken: {
    type: DataTypes.STRING,
    allowNull: true
  }
} );

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


sequelize.queryInterface.describeTable('users')
  .then(tableDefinition => {
    if (!tableDefinition['companyToken']) {
      // If the column does not exist, add it
      return sequelize.queryInterface.addColumn('users', 'companyToken', {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      });
    }
  })
  .then(() => {
    console.log('Column added successfully');
  })
  .catch(error => {
    console.error('Error adding column', error);
  });



sequelize.sync();


module.exports = 
  {
  User : User
 }



module.exports = {
  Company : Company
 }



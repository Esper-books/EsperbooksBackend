const { DataTypes,Sequelize } = require('sequelize');
const sequelize = require('../config/sequelizeDbConn');


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

//sequelize.sync();

module.exports = Company


// sequelize.sync();


// module.exports = {
//   Company : Company
//  }



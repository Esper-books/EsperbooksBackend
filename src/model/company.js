const { DataTypes,Sequelize } = require('sequelize');
const Table = require('../config/sequelizeDbConn');


 

class CompanyRepository {
 companyRepository;
constructor() {
  this.tableSync();
}

async tableSync() {
  try {
   this.companyRepository = await new Table('Company',
    {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      size: {
        type: DataTypes.STRING,
        allowNull: false
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
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
        allowNull: true,
        unique: true
      }
    } 
    
    ).createTable();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


}

module.exports = CompanyRepository





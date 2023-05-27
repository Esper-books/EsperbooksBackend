const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

sequelize =
new Sequelize(
    process.env.DB_DATABASE, 
    process.env.DB_USER, 
    process.env.DB_PASS, {
    dialect: 'mssql',
     host: process.env.DB_HOST,
     port: process.env.DB_PORT,
     dialectOptions: {
     options: {
     encrypt: false, 
    },
 },
});


// Function to define models
// const defineModel = (name, schema) => {
//   return sequelize.define(name, schema);
// };


//sequelize.sync();

// Export the Sequelize instance and defineModel function
// module.exports = {
//   sequelize,
//   defineModel,
//   Sequelize,
//   DataTypes
// };

module.exports = sequelize ; 


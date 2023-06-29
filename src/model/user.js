const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/sequelizeDbConn");
const Company = require("../model/company");
const CompanyRepository = require("../model/company");

class UserRepository extends Model {}

UserRepository.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dateOfBirth: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Company,
        key: "id",
      }
    },
    isManager: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    bioDataStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    hmnEnrollmentStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    inductionCompletedStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    gurantorChecksStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    workStationStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    licencePermitStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    workIdCardStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    softwareAccessStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    maritalStatus: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    anualLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    compassionateLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paternityLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    maternityLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    sickLeave: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    leaveWithoutPay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    backUps: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);

UserRepository.belongsTo(CompanyRepository, { foreignKey: "companyId" });
CompanyRepository.hasMany(UserRepository, { foreignKey: "companyId" });

UserRepository.sync({ force: false });



module.exports = UserRepository;